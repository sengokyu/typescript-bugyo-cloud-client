// テンプレートリテラルで使用できる名前
type pathHolders = "tenantCode" | "userCode";
type pathFormatter = (
  values: Partial<{ [k in pathHolders]: string }>
) => string;
type UrlTemplate = {
  [k in EndpointName]: Readonly<{
    baseURL: string;
    pathFormatter: pathFormatter;
  }>;
};

const pathTag =
  (strings: TemplateStringsArray, ...keys: Array<pathHolders>): pathFormatter =>
  (values) =>
    strings[0] + keys.map((key, i) => values[key] + strings[i + 1]).join("");

export type EndpointName =
  | "LoginPage"
  | "TimeClock"
  | "CheckAuthenticationMethod"
  | "Authenticate"
  | "OmRedirect"
  | "PunchmarkPage"
  | "TimeClock"
  | "CallLogout";

const BASE_AUTH_URL = "https://id.obc.jp/";
const BASE_URL = "https://hromssp.obc.jp/";

export const USER_AGENT = "Mozilla/5.0";
export const URL_TEMPLATE: Readonly<UrlTemplate> = {
  LoginPage: {
    baseURL: BASE_AUTH_URL,
    pathFormatter: pathTag`${"tenantCode"}/`,
  },
  CheckAuthenticationMethod: {
    baseURL: BASE_AUTH_URL,
    pathFormatter: pathTag`${"tenantCode"}/login/CheckAuthenticationMethod`,
  },
  Authenticate: {
    baseURL: BASE_AUTH_URL,
    pathFormatter: pathTag`${"tenantCode"}/login/login/`,
  },
  OmRedirect: {
    baseURL: BASE_AUTH_URL,
    pathFormatter: pathTag`${"tenantCode"}/omredirect/redirect/`,
  },
  PunchmarkPage: {
    baseURL: BASE_URL,
    pathFormatter: pathTag`${"tenantCode"}/${"userCode"}/timeclock/punchmark/`,
  },
  TimeClock: {
    baseURL: BASE_URL,
    pathFormatter: pathTag`${"tenantCode"}/${"userCode"}/TimeClock/InsertReadDateTime/`,
  },
  CallLogout: {
    baseURL: BASE_URL,
    pathFormatter: pathTag`${"tenantCode"}/${"userCode"}/calllogout/logout/?manuallogin=True`,
  },
};
