/** Undocumented One-Off for Mailing Information to Mentorship Participants */

import { readFileSync } from "fs";
import { renderString } from "nunjucks";
import { createTransport } from "nodemailer";
import { google, auth } from "../google-api";

interface PersonData {
  name: string;
  major: string;
  email: string;
}

interface MentorshipData {
  name: string;
  isMentor: boolean;
  mentees: PersonData[];
  mentor: PersonData;
}

const sheets = google.sheets({ version: "v4", auth });
const mail = google.gmail({ version: "v1", auth });
const transport = createTransport({
  streamTransport: true,
  buffer: true,
});

async function main() {
  console.log("Fetching spreadsheet data.");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1-X29rz1nWocYcGgKJzexV89NnDL6lmaPuqh3y_QxgN4",
    range: "Sheet1!A2:C12",
  });
  const values = res.data.values as string[][];

  const mentors = values.map<MentorshipData>((pair) => {
    const data: MentorshipData = {
      name: "",
      isMentor: true,
      mentor: { name: "", major: "", email: "" },
      mentees: [],
    };

    const pdRgx = /(.+) \(.\)\s*\n(.+)/;
    const [_, name, major] = pair[0].match(pdRgx) as string[];
    data.name = name;
    data.mentor.name = name;
    data.mentor.major = major;

    for (const [_, menteeName, menteeMajor] of Array.from(
      pair[1].matchAll(RegExp(pdRgx.source, "g"))
    )) {
      data.mentees.push({ name: menteeName, major: menteeMajor } as PersonData);
    }

    for (const [_, contactName, contactEmail] of Array.from(
      pair[2].matchAll(/(\w+): (.*\w)/g)
    )) {
      if (name.startsWith(contactName)) {
        data.mentor.email = contactEmail;
      } else {
        const p = data.mentees.find((pd) => pd.name.startsWith(contactName));
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
    const separate = raw.match(/(\S.*)\n((?:.*\n?)*)/) as string[];
    const subject = separate[1];
    const text = separate[2];
    return { subject, text };
  }

  for (const mentor of mentors) {
    const { subject, text } = formatted(mentor);
    // mentor email
    console.log(`Drafting email for "${mentor.name}"`);
    await gDraft(
      await transport.sendMail({
        from: "sums@ucsd.edu",
        to: mentor.mentor.email,
        subject,
        text,
      })
    );
    for (const mentee of mentor.mentees) {
      // mentee email
      console.log(`Drafting email for "${mentee.name}"`);
      const menteeData: MentorshipData = {
        name: mentee.name,
        isMentor: false,
        mentees: [],
        mentor: {
          name: mentor.name,
          major: mentor.mentor.major,
          email: mentor.mentor.email,
        },
      };
      const { subject, text } = formatted(menteeData);
      await gDraft(
        await transport.sendMail({
          from: "sums@ucsd.edu",
          to: mentee.email,
          subject,
          text,
        })
      );
    }
  }
}
main().catch((err) => console.log(err));
