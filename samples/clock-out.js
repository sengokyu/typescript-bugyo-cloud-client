#!/usr/bin/env node

const bcc = require("../dist");

if (process.argv.length < 3) {
  console.log("Usage: sample tenant-code login-id password");
  process.exit();
}

const loggerFactory = {
  getLogger() {
    return {
      trace: console.log,
      debug: console.log,
      info: console.log,
      error: console.log,
    };
  },
};

const main = async () => {
  const password = process.argv.pop();
  const loginId = process.argv.pop();
  const tenantCode = process.argv.pop();
  const clockType = "ClockOut";

  const loginTask = service.createLoginTask({ loginId, password });
  const logoutTask = service.createLogoutTask(loggerFactory);
  const punchTask = service.PunchTask({ clockType });

  const client = bcc.createBugyoCloudClient(tenantCode);

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
