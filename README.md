# TypeScript BUGYO Cloud Client

# Usage

```js
// Settings
const tenantCode = "Bugyo cloud tenant code";
const loginId = "Your login id";
const password = "Your password";

// Create tasks
const loginTask = new bcc.LoginTask({ loginId, password });
const punchTask = new bcc.PunchTask({ clockType: "ClockIn" });
const logoutTask = new bcc.LogoutTask();

// Create a client
const client = new bcc.BugyoCloudClient(tenantCode);

// Do tasks
await client.doA(loginTask); // At first, must do login
await client.doA(punchTask);
await client.doA(logoutTask);
```

See a [sample](/scripts/sample.js).

# Testing

```bash
npm test
```

# Running a sample

```bash
npm run sample TenantCode LoginId Password
```

# 画面あるいは API

## 認証画面

- URL: https://id.obc.jp/{{テナント?}}/
- METHOD: GET
- Response:
  - Headers:
    - Content-Type: text/html; charset=utf-8

## 認証方法チェック

- URL: https://id.obc.jp/{{テナント?}}/login/CheckAuthenticationMethod
- METHOD: POST
- Headers:
  - \_\_RequestVerificationToken: 認証画面のフォームにある hidden value
  - Content-Type: application/x-www-form-urlencoded; charset=UTF-8
  - X-Requested-With: XMLHttpRequest
- Content:
  - "OBCiD" : ログイン ID
  - "isBugyoCloud" : "false"
- Response:
  - Headers:
    - Content-Type: application/json; charset=utf-8
  - Content:
    - AuthenticationMethod
    - SAMLButtonText
    - PasswordButtonText

## 認証

- URL: https://id.obc.jp/{{テナント?}}/login/login/?Length=5
- METHOD: POST
- Headers:
  - Content-Type: application/x-www-form-urlencoded; charset=UTF-8
- Content:
  - "btnLogin" : ""
  - "OBCID" : ログイン ID
  - "Password_d1" : ""
  - "Password_d2" : ""
  - "Password_d3" : ""
  - "Password" : パスワード
  - "\_\_RequestVerificationToken" : 認証画面のフォームにある input hidden value
  - "X-Requested-With" : "XMLHttpRequest"
- Response:
  - Headers:
    - Content-Type: application/json; charset=utf-8
  - Content:
    - RedirectURL
    - LoginOBCiD

レスポンスにある RedirectURL を GET すると 302 が返ります。
302 に従うと、ユーザ初期画面へ遷移します。URL は、https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}/ のようになります。

## ユーザ初期画面

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}/
- METHOD: GET

認証後の 302 応答に従うとたどり着きます。

ユニーク文字列の部分を、このあとの処理で使います。

## 打刻画面

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユーザ初期画面URLより}}/timeclock/punchmark/
- METHOD: GET
- Response:
  - Headers:
    - Content-Type: text/html; charset=utf-8

## 打刻

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユーザ初期画面URLより}}/TimeClock/InsertReadDateTime/
- METHOD: POST
- Headers:
  - "\_\_RequestVerificationToken": 打刻画面にある input hidden value
  - "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  - "X-Requested-With" : "XMLHttpRequest"
  - "Referer" : 打刻画面の URL
- Content:
  - "ClockType" : 打刻種類
  - "LaborSystemID" : "0"
  - "LaborSystemCode" : ""
  - "LaborSystemName" : ""
  - "PositionLatitude" : 緯度
  - "PositionLongitude" : 経度
  - "PositionAccuracy" : "0"

### 打刻種類

- 出勤 = "ClockIn"
- 退出 = "ClockOut"

## ログアウト

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユーザ初期画面URLより}}/calllogout/logout/?manuallogin=True
- METHOD: GET
