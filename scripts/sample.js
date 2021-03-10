#!/usr/bin/env node

const bcc = require("../dist");

if (process.argv.length < 3) {
  console.log("Usage: sample tenant-code login-id password");
  process.exit();
}

const main = async () => {
  const password = process.argv.pop();
  const loginId = process.argv.pop();
  const tenantCode = process.argv.pop();

  const loginTask = new bcc.LoginTask({ loginId, password });
  const punchTask = new bcc.PunchTask({ clockType: "ClockIn" });
  const logoutTask = new bcc.LogoutTask();

  const client = new bcc.BugyoCloudClient(tenantCode);

  await client.doA(loginTask);

  try {
    await client.doA(punchTask);
  } finally {
    await client.doA(logoutTask);
  }
};

main()
  .then(() => console.log("Succeed."))
  .catch((reason) => console.log(reason));
