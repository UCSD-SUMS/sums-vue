# SUMS Website Related Utilities

These scripts will be compiled by running `yarn utils`.
Documentation for each utility can be found at the top of each source file in this directory.

## System Dependencies

All of the system dependencies can be installed on Ubuntu with the command `apt install <package_name>`.

* `sshpass`
  * Do to our limited ability to setup keyless ssh on the Math Department servers, we use `sshpass` with `rsync`.

## Config File

To use most of the utilities in this folder, you'll need to setup `./config.json` (where `./` refers to the directory of this readme).
The config file follows the following format:

```json
{
  "ssh": "<ssh_password for SUMS>",
  "MailChimp": "<MailChimp api key>"
}
```

## Build & Sync to the Department Server

```bash
yarn sync
# synchronize built website to the department server

yarn department
# rebuild website and run `yarn sync`
```

## Fetch the Latest Newsletters

```bash
yarn newsletters
# fetch the latest newsletters and update `latest.html`
```
