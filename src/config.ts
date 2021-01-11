type formatter = (...values: Array<string>) => string;

const formatTag = (
  strings: TemplateStringsArray,
  ...keys: Array<number>
): formatter => (...values) =>
  strings[0] + keys.map((key, i) => values[key] + strings[i + 1]).join("");

export type EndpointName =
  | "LoginPage"
  | "TimeClock"
  | "CheckAuthenticationMethod"
  | "Authenticate"
  | "PunchmarkPage"
  | "TimeClock"
  | "CallLogout";

export const USER_AGENT = "Mozilla 5.0 ()";
export const URL_TEMPLATE: { [k in EndpointName]: formatter } = {
  LoginPage: formatTag`https://id.obc.jp/${0}`,
  CheckAuthenticationMethod: formatTag`https://id.obc.jp/${0}/login/CheckAuthenticationMethod`,
  Authenticate: formatTag`https://id.obc.jp/${0}/login/login/?Length=5`,
  PunchmarkPage: formatTag`https://hromssp.obc.jp/${0}/${1}/timeclock/punchmark/`,
  TimeClock: formatTag`https://hromssp.obc.jp/${0}/${1}/TimeClock/InsertReadDateTime/`,
  CallLogout: formatTag`https://hromssp.obc.jp/${0}/${1}/calllogout/logout/?manuallogin=True`,
};

export const BASE_URL = "https://hromssp.obc.jp/";
