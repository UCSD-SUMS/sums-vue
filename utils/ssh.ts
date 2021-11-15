/** Open an SSH Terminal with the Department */

import { execSync } from "child_process";
import { getConfigSync } from "./config";

const { ssh_password } = getConfigSync();

// We use `sshpass` to feed the configured password to `ssh`.
execSync("sshpass -e ssh sums@sums.ucsd.edu", {
  stdio: "inherit",
  env: { SSHPASS: ssh_password },
});
