/** Undocumented One-Off for Mailing Information to Mentorship Participants */

import { readFileSync, writeFileSync } from "fs";
import { renderString } from "nunjucks";
import { createTransport } from "nodemailer";
import { google, auth } from "../google-api";

interface PersonData {
  name: string;
  email: string;
}

interface MentorshipData extends PersonData {
  isMentor: boolean;
  mentees: PersonData[];
  mentor: PersonData;
}

const sheets = google.sheets({ version: "v4", auth });
const mail = {} as any; // google.gmail({ version: "v1", auth });
const transport = createTransport({
  streamTransport: true,
  buffer: true,
});

async function main() {
  console.log("Fetching spreadsheet data.");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1jDjao456W9DU06gTLMnaWIIir6g483WX9C1WgfAFqmk",
    range: "Sheet1!A2:C6",
  });
  const values = res.data.values as string[][];

  const mentors = values.map<MentorshipData>((pair) => {
    const data: MentorshipData = {
      name: "",
      email: "",
      isMentor: true,
      mentor: { name: "", email: "" },
      mentees: [],
    };

    const name = pair[0];
    data.name = name;
    data.mentor.name = name;

    for (const [menteeName] of pair[1].matchAll(/\w+/g)) {
      data.mentees.push({ name: menteeName } as PersonData);
    }

    const contacts = Array.from(pair[2].matchAll(/(\w+): (.+\w)/g));
    for (let i = 0; i < contacts.length; i++) {
      const [_, contactName, contactEmail] = contacts[i];
      if (i === 0) {
        data.email = contactEmail;
        data.mentor.email = contactEmail;
      } else {
        const p = data.mentees.find((pd) => pd.name.includes(contactName));
        if (p !== undefined) p.email = contactEmail;
      }
    }

    return data;
  });

  async function gDraft(info: { message: Buffer }) {
    await mail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: { raw: info.message.toString("base64url" as any) },
      }, // requires nodejs 15
    });
  }

  const template = readFileSync("utils/email-templates/mentorship.md", "utf8");

  function formatted(data: MentorshipData): { subject: string; text: string } {
    const raw = renderString(template, data);
    const separate = raw.split(";;;").map((s) => s.trim());
    const subject = separate[0];
    const text = separate[1];
    return { subject, text };
  }

  // temporary solution
  function dump(data: MentorshipData) {
    writeFileSync("tmp/" + data.name + ".json", JSON.stringify(data, null, 4));
    writeFileSync("tmp/" + data.name, formatted(data).text);
  }

  for (const mentor of mentors) {
    const { subject, text } = formatted(mentor);
    // mentor email
    console.log(`Drafting email for "${mentor.name}"`);
    /*await gDraft(
      await transport.sendMail({
        from: "sums@ucsd.edu",
        to: mentor.mentor.email,
        subject,
        text,
      })
    );*/
    dump(mentor); // TODO
    for (const mentee of mentor.mentees) {
      // mentee email
      console.log(`Drafting email for "${mentee.name}"`);
      const menteeData: MentorshipData = {
        ...mentee,
        isMentor: false,
        mentees: [],
        mentor: {
          name: mentor.name,
          email: mentor.mentor.email,
        },
      };
      const { subject, text } = formatted(menteeData);
      /*await gDraft(
        await transport.sendMail({
          from: "sums@ucsd.edu",
          to: mentee.email,
          subject,
          text,
        })
      );*/
      dump(menteeData);
    }
  }
}
main().catch((err) => console.log(err));
