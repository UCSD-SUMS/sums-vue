import { promises as fs, readFileSync } from "fs";

const configPath = "config.json";

export interface Config {
  /** SSH password for SUMS website at the Math department */
  ssh_password: string;
  /** MailChimp api key */
  MailChimp: string;
  /** Google OAuth2 client id */
  gClientId: string;
  /** Google OAuth2 client secret */
  gClientSecret: string;
  /** Google OAuth2 refresh token
   *
   * Can be gotten from the Google OAuth playground for temporary use.
   */
  gRefreshToken: string;
  /** Google OAuth2 access token */
  gAccessToken: string;
}

export async function getConfig(): Promise<Config> {
  const raw = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw);
}

export function getConfigSync(): Config {
  const raw = readFileSync(configPath, "utf8");
  return JSON.parse(raw);
}
