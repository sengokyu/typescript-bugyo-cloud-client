# TypeScript BUGYO Cloud Client

# Usage

```js
const bcc = require("bugyo-cloud-client");

// Implement LoggerFactory
const loggerFactory = {
  getLogger(name) {
    // (snip)
  },
};
// Settings
const tenantCode = "Bugyo cloud tenant code";
const loginId = "Your login id";
const password = "Your password";

// Create tasks
const loginTask = new bcc.LoginTask({ loginId, password }, loggerFactory);
const punchTask = new bcc.PunchTask({ clockType: "ClockIn" }, loggerFactory);
const logoutTask = new bcc.LogoutTask(loggerFactory);

// Create a client
const client = bcc.createBugyoCloudClient(tenantCode);

// Do tasks
await client.doA(loginTask); // At first, must do login
await client.doA(punchTask);
await client.doA(logoutTask);
```

See a samples.

- [login and logout](./samples/login-logout.js)
- [clock in](./samples/clock-in.js)
- [clock out](./samples//clock-out.js)

# Testing

```bash
npm test
```

# Running a sample

```bash
npm run sample TenantCode LoginId Password
```

# 画面あるいは API

**2025-9-1 更新**

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
  - Status: 200
  - Headers:
    - Content-Type: application/json; charset=utf-8
  - Content:
    - AuthenticationMethod: number
    - SAMLButtonText: string
    - PasswordButtonText: string
    - SSOMethod: number

## 認証

- URL: https://id.obc.jp/{{テナント?}}/login/login/
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
  - Status: 200
  - Headers:
    - Content-Type: application/json; charset=utf-8
  - Content: 空

**2025-9-1 以前は、ここでリダイレクト先 URL を取得できました。**

## ワンタイムトークン URL 取得

- URL: https://id.obc.jp/{{テナント?}}/omredirect/redirect/
- METHOD: GET
- Headers:
  - Referer: https://id.obc.jp/{{テナント?}}/
- Response:
  - Status: 302
  - Headers
    - Location: ワンタイムトークン URL

リダイレクト先 URL にはワンタイムトークンが含まれています。

## リダイレクト先 URL 取得

- URL: (先に取得したワンタイムトークン URL)
- METHOD: GET
- Headers:
  - Referer: https://id.obc.jp/{{テナント?}}/
- Response:
  - Status: 302
  - Headers:
    - Location: リダイレクト先 URL

302 に従うとユーザ初期画面へ遷移します。URL は、https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}/ のようになります。

## ユーザ初期画面

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}/
- METHOD: GET

認証後の 302 応答に従うとたどり着きます。

ユニーク文字列の部分を、このあとの処理で使います。

## 打刻画面

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}/timeclock/punchmark/
- METHOD: GET
- Response:
  - Headers:
    - Content-Type: text/html; charset=utf-8

## 打刻

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列？}}}/TimeClock/InsertReadDateTime/
- METHOD: POST
- Headers:
  - "\_\_RequestVerificationToken": 打刻画面にある input hidden value
  - "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  - "X-Requested-With" : "XMLHttpRequest"
  - "Referer" : 打刻画面の URL

### form 内容

| Form name           | Form value |
| :------------------ | :--------- |
| "ClockType"         | 打刻種類   |
| "LaborSystemID"     | "0"        |
| "LaborSystemCode"   | ""         |
| "LaborSystemName"   | ""         |
| "PositionLatitude"  | 緯度       |
| "PositionLongitude" | 経度       |
| "PositionAccuracy"  | "0"        |

### 打刻種類

- 出勤 = "ClockIn"
- 退出 = "ClockOut"

## ログアウト

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列}}/calllogout/logout/?manuallogin=True
- METHOD: GET

## 申請

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユニーク文字列}}/Workflow/Apply/
- METHOD: POST
- Headers:
  - Content-Type: multipart/form-data

### form-data 内容

| Form data name                                | Form data value                   | Sample value                           |
| :-------------------------------------------- | :-------------------------------- | :------------------------------------- |
| "\_\_RequestVerificationToken"                | 入力画面にある input hidden value | （略）                                 |
| "applyReasonRadios"                           | 事由ラジオボタンの値(?)           | "0"                                    |
| "applyUnitRadios"                             | (?)                               | "0"                                    |
| "js-application\_\_basicDate"                 | 開始日付                          | "2024/3/21 10:37:39"                   |
| "js-application\_\_endDate"                   | 終了日付                          | "2024/3/22 10:37:39"                   |
| "js-application\_\_startTime.TimeBoxDateType" | 開始時刻が n 日目か(?)            | "1"                                    |
| "js-application\_\_startTime.Hour"            | 開始時刻（時間）                  | "18"                                   |
| "js-application\_\_startTime.Minute"          | 開始時刻（分）                    | "00"                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "View_24hour"                          |
| TimeBoxInfo.NavigationType"                   | (?)                               | "Separation"                           |
| "js-application\_\_endTime.TimeBoxDateType"   | 終了時刻が n 日目か(?)            | "1"                                    |
| "js-application\_\_endTime.Hour"              | 終了時刻（時間）                  | "22"                                   |
| "js-application\_\_endTime.Minute"            | 終了時刻（分）                    | "00"                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "View_24hour"                          |
| "TimeBoxInfo.NavigationType"                  | (?)                               | "Separation"                           |
| "js-application\_\_punchMarkStartDate"        | (?)                               | "2024/3/21 0:0:0"                      |
| "js-application\_\_startTimeWith.Hour"        | (?)                               | （空）                                 |
| "js-application\_\_startTimeWith.Minute"      | (?)                               | （空）                                 |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "Normal"                               |
| "TimeBoxInfo.NavigationType"                  | (?)                               | "Separation"                           |
| "js-application\_\_punchMarkEndDate"          | (?)                               | "2024/3/21 0:0:0"                      |
| "js-application\_\_endTimeWith.Hour"          | (?)                               | （空）                                 |
| "js-application\_\_endTimeWith.Minute"        | (?)                               | （空）                                 |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "Normal"                               |
| "TimeBoxInfo.NavigationType"                  | (?)                               | "Separation"                           |
| "js-application\_\_startTimeFor.Hour"         | (?)                               | （空）                                 |
| "js-application\_\_startTimeFor.Minute"       | (?)                               | （空）                                 |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "Normal"                               |
| "TimeBoxInfo.NavigationType"                  | (?)                               | "Separation"                           |
| "js-application\_\_endTimeFor.Hour"           | (?)                               | （空）                                 |
| "js-application\_\_endTimeFor.Minute"         | (?)                               | （空）                                 |
| "TimeBoxInfo.IsBorder"                        | (?)                               | "value"                                |
| "TimeBoxInfo.HourViewType"                    | (?)                               | "Normal"                               |
| "TimeBoxInfo.NavigationType"                  | (?)                               | "Separation"                           |
| "js-application\_\_calcSpanDate"              | (?)                               | ":"                                    |
| "js-application\_\_calcSpanDateHour"          | (?)                               | "0"                                    |
| "js-application\_\_calcSpanPeriod"            | 計算した経過時間                  | "4:00"                                 |
| "js-application\_\_calcSpanPeriodHour"        | (?)                               | "0"                                    |
| "attachedFile"                                | 添付ファイル(?)                   | Content-Type: application/octet-stream |
| "Details[0].ReasonIndex"                      | 詳細 1: 事由ラジオボタンの値(?)   | "0"                                    |
| "Details[0].ApplyUnit"                        | (?)                               | "0"                                    |
| "Details[0].BasicDate"                        | 詳細 1: 日付                      | "2024/3/21"                            |
| "Details[0].StartDate"                        | (?)                               | （空）                                 |
| "Details[0].EndDate"                          | (?)                               | （空）                                 |
| "Details[0].StartTime"                        | 詳細 1: 開始時刻                  | "18:00"                                |
| "Details[0].EndTime"                          | 詳細 1: 終了時刻                  | "22:00"                                |
| "Details[0].SpanDay"                          | (?)                               | （空）                                 |
| "Details[0].ClockType"                        | (?)                               | （空）                                 |
| "Details[0].MultiLaborTime"                   | (?)                               | （空）                                 |
| "Details[0].PunchMarkTime"                    | (?)                               | （空）                                 |
| "Details[0].CalcSpan"                         | 詳細 1: 計算した経過時間          | "4 時間 00 分"                         |
| "Details[0].AttendanceHoliday1"               | (?)                               | （空）                                 |
| "Details[0].AttendanceHoliday2"               | (?)                               | （空）                                 |
| "Details[0].AttendanceHoliday3"               | (?)                               | （空）                                 |
| "Details[0].AttendanceHoliday4"               | (?)                               | （空）                                 |
| "Details[0].AttendanceHoliday5"               | (?)                               | （空）                                 |
| "Details[0].ByteDoCompDay"                    | (?)                               | "0"                                    |
| "Details[0].CompDayBasicDate"                 | (?)                               | （空）                                 |
| "Details[0].CompDayStartDate"                 | (?)                               | （空）                                 |
| "Details[0].CompDayStartTime"                 | (?)                               | （空）                                 |
| "Details[0].CompDayEndDate"                   | (?)                               | （空）                                 |
| "Details[0].CompDayEndTime"                   | (?)                               | （空）                                 |
| "Details[0].CompDaySpanDay"                   | (?)                               | （空）                                 |
| "Details[0].CompDayCalcSpan"                  | (?)                               | （空）                                 |
| "Details[0].InitialApplylNo"                  | (?)                               | （空）                                 |
| "Details[0].InitialApplyNo"                   | (?)                               | （空）                                 |
| "CommuteRoute"                                | (?)                               | （空）                                 |
| "Cause"                                       | 事由                              | "作業のため"                           |
| "Address"                                     | (?)                               | （空）                                 |
| "Memo"                                        | (?)                               | （空）                                 |
| "AttachedFileCount"                           | 添付ファイル数(?)                 | "0"                                    |
| "WorkflowName"                                | (?)                               | （空）                                 |
| "WorkflowID"                                  | (?)                               | （空）                                 |
| "ApplicationPositionCount"                    | (?)                               | （空）                                 |
| "ApplicationPositionName"                     | (?)                               | （空）                                 |
| "RestDaysNameList1"                           | (?)                               | （空）                                 |
| "RestDaysNameList2"                           | (?)                               | （空）                                 |
| "RestDaysNameList3"                           | (?)                               | （空）                                 |
| "RestDaysNameList4"                           | (?)                               | （空）                                 |
| "RestDaysNameList5"                           | (?)                               | （空）                                 |
| "RestDaysNameList6"                           | (?)                               | （空）                                 |
| "RestDaysNameList7"                           | (?)                               | （空）                                 |
| "RestDaysNameList8"                           | (?)                               | （空）                                 |
| "RestDaysNameList9"                           | (?)                               | （空）                                 |
| "RestDaysNameList10"                          | (?)                               | （空）                                 |
| "RestDaysNameList11"                          | (?)                               | （空）                                 |
| "RestDaysNameList12"                          | (?)                               | （空）                                 |
| "RestDaysList1"                               | (?)                               | （空）                                 |
| "RestDaysList2"                               | (?)                               | （空）                                 |
| "RestDaysList3"                               | (?)                               | （空）                                 |
| "RestDaysList4"                               | (?)                               | （空）                                 |
| "RestDaysList5"                               | (?)                               | （空）                                 |
| "RestDaysList6"                               | (?)                               | （空）                                 |
| "RestDaysList7"                               | (?)                               | （空）                                 |
| "RestDaysList8"                               | (?)                               | （空）                                 |
| "RestDaysList9"                               | (?)                               | （空）                                 |
| "RestDaysList10"                              | (?)                               | （空）                                 |
| "RestDaysList11"                              | (?)                               | （空）                                 |
| "RestDaysList12"                              | (?)                               | （空）                                 |
| "RestTimeList1"                               | (?)                               | （空）                                 |
| "RestTimeList2"                               | (?)                               | （空）                                 |
| "RestTimeList3"                               | (?)                               | （空）                                 |
| "RestTimeList4"                               | (?)                               | （空）                                 |
| "RestTimeList5"                               | (?)                               | （空）                                 |
| "RestTimeList6"                               | (?)                               | （空）                                 |
| "RestTimeList7"                               | (?)                               | （空）                                 |
| "RestTimeList8"                               | (?)                               | （空）                                 |
| "RestTimeList9"                               | (?)                               | （空）                                 |
| "RestTimeList10"                              | (?)                               | （空）                                 |
| "RestTimeList11"                              | (?)                               | （空）                                 |
| "RestTimeList12"                              | (?)                               | （空）                                 |
| "TotalOverTimeItemNameList1"                  | (?)                               | （空）                                 |
| "TotalOverTimeItemNameList2"                  | (?)                               | （空）                                 |
| "TotalOverTimeItemList1"                      | (?)                               | （空）                                 |
| "TotalOverTimeItemList2"                      | (?)                               | （空）                                 |
| "Val"                                         | (?)                               | "true"                                 |
| "WorkerTaskModelList_Stamp"                   | (?)                               | （空）                                 |
| "AppliedDivision"                             | (?)                               | "Overtime"                             |
| "TaskID"                                      | (?)                               | "00000000-0000-0000-0000-000000000000" |
| "Comment"                                     | (?)                               | （空）                                 |
| "IsAlreadyIncorrectApplyChecked"              | (?)                               | "false"                                |
| "ByIncorrectApply"                            | (?)                               | "False"                                |
| "ByTemporarySavedApplicationForm"             | (?)                               | "False"                                |
| "CtrlId"                                      | (?)                               | "--"                                   |
