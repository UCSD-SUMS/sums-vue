/** Fetch and Prepare the Latest Newsletters
 *
 * The last ~10 newsletters are fetched from SUMS' MailChimp account.
 * Each newsletter is stored under `public/newsletters/yyyy-MM-dd.html`
 * according to the date it was sent out to members.
 * The latest newsletter fetched is copied to `public/newsletters/latest.html`.
 */

import { promises as fs } from "fs";
const { copyFile, writeFile, access } = fs; // annoying work-around until import "fs/promises"
import { join } from "path";
import { DateTime } from "luxon";
import fetch from "node-fetch";
import { MailChimp as apiKey } from "./config.json";

// MailChimp requires this particular prefix before `api.mailchimp.com` for our account
const prefix = "us15";
// where to store the fetched newsletters
const baseNewsletters = "src/.vuepress/public/newsletters/";

/** Convert a string to its base64 representation. */
function base64(s: string): string {
  return Buffer.from(s).toString("base64");
}

/** Construct an HTTP basic auth header for MailChimp. */
function auth(): string {
  return `Basic ${base64(`sums:${apiKey}`)}`;
}

/** Perform a request against the MailChimp api. */
async function getApi<T>(
  /** Endpoint as given in MailChimp reference documentation */
  endpoint: string
): Promise<T> {
  const r = await fetch(`https://${prefix}.api.mailchimp.com/3.0${endpoint}`, {
    headers: {
      authorization: auth(),
    },
  });
  return await r.json();
}

/** Simplified model for the api campaign response */
interface ApiCampaign {
  /** Unique string associated which identifies this campaign */
  id: string;
  /** ISO formatted time when campaign was sent */
  send_time: string;
  settings: {
    /** Email subject line (sometimes is `""`) */
    subject_line: string;
    /** Title (sometimes is `""`) */
    title: string;
  };
}

/** Simplest representation of campaign */
interface Campaign {
  id: string;
  /** Either `subject_line` or `title` (try to not be `""`) */
  title: string;
  sendTime: DateTime;
}

/** Fetch the latest newsletters from MailChimp. */
async function grabNewsletters(): Promise<Campaign[]> {
  // fetch ~10 of the latest campaigns
  const params = new URLSearchParams({
    sort_field: "send_time",
    sort_dir: "DESC",
  });
  const { campaigns } = await getApi<{ campaigns: ApiCampaign[] }>(
    `/campaigns?${params}`
  );

  // convert api model to our own representation
  const formatted = campaigns.reduce<Campaign[]>((ns, c) => {
    ns.push({
      id: c.id,
      // attempt to choose whichever option is not `""`
      title:
        c.settings.title !== "" ? c.settings.title : c.settings.subject_line,
      sendTime: DateTime.fromISO(c.send_time),
    });
    return ns;
  }, []);

  // filter out the newsletters from the fetched campaigns
  const newsletters = formatted.filter((c) => {
    try {
      return c.title.toLowerCase().match("newsletter");
    } catch {
      return false;
    }
  });

  return newsletters;
}

/** Fetch the HTML version of a campaign email. */
async function grabHtml(campaignId: string): Promise<string> {
  const { archive_html } = await getApi<{ archive_html: string }>(
    `/campaigns/${campaignId}/content?fields=archive_html`
  );

  // throw error if MailChimp did not know the provided campaign id
  if (archive_html === undefined) {
    throw new Error("bad campaign id");
  } else {
    return archive_html;
  }
}

/** Execute the main program. */
async function main() {
  // grab the latest newsletters
  const ns = await grabNewsletters();
  // set *old* date which is earlier than any SUMS newsletter
  let latestTime: DateTime = DateTime.fromMillis(0);

  // store each newsletter if possible
  for (let n of ns) {
    const d = n.sendTime;
    const timeStr = d.setZone("America/Los_Angeles").toFormat("yyyy-MM-dd");
    const filename = `${timeStr}.html`;
    const filePath = join(baseNewsletters, filename);

    try {
      // if newsletter has already been saved, skip it
      await access(filePath);
      continue;
    } catch {
      // try to save newsletter, but don't overwrite existing data
      console.log(`Recording ${timeStr} newsletter`);
      await writeFile(filePath, await grabHtml(n.id), {
        flag: "wx",
      }).catch((err) => {
        console.log(err);
      });
    }

    // copy newsletter to latest.html if it is the most modern
    // this algorithm performs unnecessary writes
    // maybe it should be improved in the future
    if (d.diff(latestTime).valueOf() > 0) {
      latestTime = d;
      await copyFile(filePath, join(baseNewsletters, "latest.html"));
    }
  }
}

// start main and handle rejection
main().catch((err) =>
  setImmediate(() => {
    throw err;
  })
);
