/** Grab Latest Newsletters */

import { promises as fs } from "fs";
const { copyFile, writeFile, access } = fs; // annoying work-around until import "fs/promises"
import { join } from "path";
import { DateTime } from "luxon";
import fetch from "node-fetch";
import { MailChimp as apiKey } from "./config.json";

const prefix = "us15";
const baseNewsletters = "src/.vuepress/public/newsletters/";

function base64(s: string): string {
  return Buffer.from(s).toString("base64");
}

function auth(): string {
  return `Basic ${base64(`sums:${apiKey}`)}`;
}

async function getApi<T>(endpoint: string): Promise<T> {
  const r = await fetch(`https://${prefix}.api.mailchimp.com/3.0${endpoint}`, {
    headers: {
      authorization: auth(),
    },
  });
  return await r.json();
}

interface ApiCampaign {
  id: string;
  send_time: string;
  settings: {
    title: string;
  };
}

interface Campaign {
  id: string;
  title: string;
  sendTime: DateTime;
}

async function grabNewsletters(): Promise<Campaign[]> {
  const params = new URLSearchParams({
    sort_field: "send_time",
    sort_dir: "DESC",
  });
  const { campaigns } = await getApi<{ campaigns: ApiCampaign[] }>(
    `/campaigns?${params}`
  );
  const formatted = campaigns.reduce<Campaign[]>((ns, c) => {
    ns.push({
      id: c.id,
      title: c.settings.title,
      sendTime: DateTime.fromISO(c.send_time),
    });
    return ns;
  }, []);
  const newsletters = formatted.filter((c) =>
    c.title.toLowerCase().match("newsletter")
  );
  return newsletters;
}

async function grabHtml(campaignId: string): Promise<string> {
  const { archive_html } = await getApi<{ archive_html: string }>(
    `/campaigns/${campaignId}/content?fields=archive_html`
  );
  if (archive_html === undefined) {
    throw new Error("bad campaign id");
  } else {
    return archive_html;
  }
}

async function main() {
  const ns = await grabNewsletters();
  let latestTime: DateTime = DateTime.fromMillis(0);

  for (let n of ns) {
    const d = n.sendTime;
    const timeStr = d.setZone("America/Los_Angeles").toFormat("yyyy-MM-dd");
    const filename = `${timeStr}.html`;
    const filePath = join(baseNewsletters, filename);

    try {
      await access(filePath);
      continue;
    } catch {}

    console.log(`Recording ${timeStr} newsletter`);
    await writeFile(filePath, await grabHtml(n.id), {
      flag: "wx",
    }).catch((err) => {
      console.log(err);
    });

    if (d.diff(latestTime).valueOf() > 0) {
      latestTime = d;
      await copyFile(filePath, join(baseNewsletters, "latest.html"));
    }
  }
}

main().catch((err) =>
  setImmediate(() => {
    throw err;
  })
);
