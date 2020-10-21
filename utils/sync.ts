/** Synchronize Local Copy of Site Into Department Server */

import { execSync } from "child_process";
import { ssh as ssh_key } from "./config.json";

// We use `sshpass` to feed the configured password to `rsync`.
execSync(
  `sshpass -p "${ssh_key}" rsync -r --del --progress docs/ sums@sums.ucsd.edu:public_html`,
  {
    stdio: "inherit",
  }
);
