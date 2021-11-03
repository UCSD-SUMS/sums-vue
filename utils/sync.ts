/** Synchronize Local Copy of Site Into Department Server */

import { execSync } from "child_process";
import { getConfigSync } from "./config";

const { ssh_password } = getConfigSync();

// We use `sshpass` to feed the configured password to `rsync`.
execSync(
  `sshpass -e rsync -r --del --progress docs/ sums@sums.ucsd.edu:public_html`,
  {
    stdio: "inherit",
    env: { SSHPASS: ssh_password },
  }
);
