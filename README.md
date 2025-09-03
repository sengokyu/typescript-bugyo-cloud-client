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
const client = new bcc.BugyoCloudClient(tenantCode);

// Do tasks
await client.doA(loginTask); // At first, must do login
await client.doA(punchTask);
await client.doA(logoutTask);
```

See a [sample](/samples/clock-in.js).

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

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユーザ初期画面URLより}}/calllogout/logout/?manuallogin=True
- METHOD: GET

## 申請

- URL: https://hromssp.obc.jp/{{テナント？}}/{{ユーザ初期画面URLより}}/Workflow/Apply/
- METHOD: POST
- Headers:
  - Content-Type: multipart/form-data

### form-data 内容

| Form data name                                | Form data description                 | Sample value                         |
| :-------------------------------------------- | :------------------------------------ | :----------------------------------- |
| "\_\_RequestVerificationToken"                | Input hidden value at the form screen | (snip)                               |
| "applyReasonRadios"                           | Detail 1 radio value                  | 0                                    |
| "applyUnitRadios"                             | (?)                                   | 0                                    |
| "js-application\_\_basicDate"                 | Detail 1 target date(?)               | 2024/3/22 ::                         |
| "js-application\_\_endDate"                   | Detail 1 input date(?)                | 2024/03/27 ::                        |
| "js-application\_\_startTime.TimeBoxDateType" | (?)                                   | 1                                    |
| "js-application\_\_startTime.Hour"            | Detail 1 start time (hour)            | 18                                   |
| "js-application\_\_startTime.Minute"          | Detail 1 start time (minute)          | 00                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | View_24hour                          |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_endTime.TimeBoxDateType"   | (?)                                   | 1                                    |
| "js-application\_\_endTime.Hour"              | Detail 1 end time (hour)              | 22                                   |
| "js-application\_\_endTime.Minute"            | Detail 1 end time (minute)            | 00                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | View_24hour                          |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_punchMarkStartDate"        | Detail 1 target date (?)              | 2024/3/22 0:0:0                      |
| "js-application\_\_startTimeWith.Hour"        | (?)                                   |                                      |
| "js-application\_\_startTimeWith.Minute"      | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_punchMarkEndDate"          | Detail 1 target date (?)              | 2024/3/22 0:0:0                      |
| "js-application\_\_endTimeWith.Hour"          | (?)                                   |                                      |
| "js-application\_\_endTimeWith.Minute"        | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_startTimeFor.Hour"         | (?)                                   |                                      |
| "js-application\_\_startTimeFor.Minute"       | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_endTimeFor.Hour"           | (?)                                   |                                      |
| "js-application\_\_endTimeFor.Minute"         | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_calcSpanDate"              | (?)                                   | :                                    |
| "js-application\_\_calcSpanDateHour"          | (?)                                   | 0                                    |
| "js-application\_\_calcSpanPeriod"            | Detail 1 calclated span               | 4:00                                 |
| "js-application\_\_calcSpanPeriodHour"        | (?)                                   | 0                                    |
| "applyReasonRadios2"                          | Detail 2 radio value                  | 1                                    |
| "applyUnitRadios2"                            | (?)                                   | 0                                    |
| "js-application\_\_basicDate_2"               | Detail 2 target date (?)              | 2024/3/22 10:16:47                   |
| "js-application\_\_endDate_2"                 | Detail 2 input date (?)               | 2024/3/27 10:16:47                   |
| "js-application\_\_startTime.TimeBoxDateType" | (?)                                   | 1                                    |
| "js-application\_\_startTime.Hour"            | Detail 2 start time (hour)            | 22                                   |
| "js-application\_\_startTime.Minute"          | Detail 2 start time (minute)          | 00                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | View_24hour                          |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_endTime.TimeBoxDateType"   | (?)                                   | 1                                    |
| "js-application\_\_endTime.Hour"              | Detail 2 end time (hour)              | 22                                   |
| "js-application\_\_endTime.Minute"            | Detail 2 end time (minute)            | 30                                   |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | View_24hour                          |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_punchMarkStartDate_2"      | Detail 2 target date (?)              | 2024/3/22 0:0:0                      |
| "js-application\_\_startTimeWith.Hour"        | (?)                                   |                                      |
| "js-application\_\_startTimeWith.Minute"      | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_punchMarkEndDate_2"        | Detail 2 target date (?)              | 2024/3/22 0:0:0                      |
| "js-application\_\_endTimeWith.Hour"          | (?)                                   |                                      |
| "js-application\_\_endTimeWith.Minute"        | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_startTimeFor.Hour"         | (?)                                   |                                      |
| "js-application\_\_startTimeFor.Minute"       | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_endTimeFor.Hour"           | (?)                                   |                                      |
| "js-application\_\_endTimeFor.Minute"         | (?)                                   |                                      |
| "TimeBoxInfo.IsBorder"                        | (?)                                   | value                                |
| "TimeBoxInfo.HourViewType"                    | (?)                                   | Normal                               |
| "TimeBoxInfo.NavigationType"                  | (?)                                   | Separation                           |
| "js-application\_\_calcSpanDate"              | (?)                                   | :                                    |
| "js-application\_\_calcSpanDateHour"          | (?)                                   | 0                                    |
| "js-application\_\_calcSpanPeriod"            | Detail 2 calclated span               | 0:30                                 |
| "js-application\_\_calcSpanPeriodHour"        | (?)                                   | 0                                    |
| "attachedFile"                                | attached file                         |                                      |
| "Details[0].ReasonIndex"                      | Detail 1 index number                 | 0                                    |
| "Details[0].ApplyUnit"                        | (?)                                   | 0                                    |
| "Details[0].BasicDate"                        | Detail 1 target date                  | 2024/3/22                            |
| "Details[0].StartDate"                        | (?)                                   |                                      |
| "Details[0].EndDate"                          | (?)                                   |                                      |
| "Details[0].StartTime"                        | Detail 1 start time                   | 18:00                                |
| "Details[0].EndTime"                          | Detail 1 end time                     | 22:00                                |
| "Details[0].SpanDay"                          | (?)                                   |                                      |
| "Details[0].ClockType"                        | (?)                                   |                                      |
| "Details[0].MultiLaborTime"                   | (?)                                   |                                      |
| "Details[0].PunchMarkTime"                    | (?)                                   |                                      |
| "Details[0].CalcSpan"                         | Detail 1 calclated span               | 4 時間 00 分                         |
| "Details[0].AttendanceHoliday1"               | (?)                                   |                                      |
| "Details[0].AttendanceHoliday2"               | (?)                                   |                                      |
| "Details[0].AttendanceHoliday3"               | (?)                                   |                                      |
| "Details[0].AttendanceHoliday4"               | (?)                                   |                                      |
| "Details[0].AttendanceHoliday5"               | (?)                                   |                                      |
| "Details[0].ByteDoCompDay"                    | (?)                                   | 0                                    |
| "Details[0].CompDayBasicDate"                 | (?)                                   |                                      |
| "Details[0].CompDayStartDate"                 | (?)                                   |                                      |
| "Details[0].CompDayStartTime"                 | (?)                                   |                                      |
| "Details[0].CompDayEndDate"                   | (?)                                   |                                      |
| "Details[0].CompDayEndTime"                   | (?)                                   |                                      |
| "Details[0].CompDaySpanDay"                   | (?)                                   |                                      |
| "Details[0].CompDayCalcSpan"                  | (?)                                   |                                      |
| "Details[0].InitialApplylNo"                  | (?)                                   |                                      |
| "Details[0].InitialApplyNo"                   | (?)                                   |                                      |
| "Details[1].ReasonIndex"                      | Detail 2 index number                 | 1                                    |
| "Details[1].ApplyUnit"                        | (?)                                   | 0                                    |
| "Details[1].BasicDate"                        | Detail 2 target date                  | 2024/3/22                            |
| "Details[1].StartDate"                        | (?)                                   |                                      |
| "Details[1].EndDate"                          | (?)                                   |                                      |
| "Details[1].StartTime"                        | Detail 2 start time                   | 22:00                                |
| "Details[1].EndTime"                          | Detail 2 end time                     | 22:30                                |
| "Details[1].SpanDay"                          | (?)                                   |                                      |
| "Details[1].ClockType"                        | (?)                                   |                                      |
| "Details[1].MultiLaborTime"                   | (?)                                   |                                      |
| "Details[1].PunchMarkTime"                    | (?)                                   |                                      |
| "Details[1].CalcSpan"                         | Detail 2 calclated span               | 0 時間 30 分                         |
| "Details[1].AttendanceHoliday1"               | (?)                                   |                                      |
| "Details[1].AttendanceHoliday2"               | (?)                                   |                                      |
| "Details[1].AttendanceHoliday3"               | (?)                                   |                                      |
| "Details[1].AttendanceHoliday4"               | (?)                                   |                                      |
| "Details[1].AttendanceHoliday5"               | (?)                                   |                                      |
| "Details[1].ByteDoCompDay"                    | (?)                                   | 0                                    |
| "Details[1].CompDayBasicDate"                 | (?)                                   |                                      |
| "Details[1].CompDayStartDate"                 | (?)                                   |                                      |
| "Details[1].CompDayStartTime"                 | (?)                                   |                                      |
| "Details[1].CompDayEndDate"                   | (?)                                   |                                      |
| "Details[1].CompDayEndTime"                   | (?)                                   |                                      |
| "Details[1].CompDaySpanDay"                   | (?)                                   |                                      |
| "Details[1].CompDayCalcSpan"                  | (?)                                   |                                      |
| "Details[1].InitialApplylNo"                  | (?)                                   |                                      |
| "Details[1].InitialApplyNo"                   | (?)                                   |                                      |
| "CommuteRoute"                                | (?)                                   |                                      |
| "Cause"                                       | 事由                                  | 作業のため                           |
| "Address"                                     | (?)                                   |                                      |
| "Memo"                                        | (?)                                   |                                      |
| "AttachedFileCount"                           | (?)                                   | 0                                    |
| "WorkflowName"                                | (?)                                   |                                      |
| "WorkflowID"                                  | (?)                                   |                                      |
| "ApplicationPositionCount"                    | (?)                                   |                                      |
| "ApplicationPositionName"                     | (?)                                   |                                      |
| "RestDaysNameList1"                           | (?)                                   |                                      |
| "RestDaysNameList2"                           | (?)                                   |                                      |
| "RestDaysNameList3"                           | (?)                                   |                                      |
| "RestDaysNameList4"                           | (?)                                   |                                      |
| "RestDaysNameList5"                           | (?)                                   |                                      |
| "RestDaysNameList6"                           | (?)                                   |                                      |
| "RestDaysNameList7"                           | (?)                                   |                                      |
| "RestDaysNameList8"                           | (?)                                   |                                      |
| "RestDaysNameList9"                           | (?)                                   |                                      |
| "RestDaysNameList10"                          | (?)                                   |                                      |
| "RestDaysNameList11"                          | (?)                                   |                                      |
| "RestDaysNameList12"                          | (?)                                   |                                      |
| "RestDaysList1"                               | (?)                                   |                                      |
| "RestDaysList2"                               | (?)                                   |                                      |
| "RestDaysList3"                               | (?)                                   |                                      |
| "RestDaysList4"                               | (?)                                   |                                      |
| "RestDaysList5"                               | (?)                                   |                                      |
| "RestDaysList6"                               | (?)                                   |                                      |
| "RestDaysList7"                               | (?)                                   |                                      |
| "RestDaysList8"                               | (?)                                   |                                      |
| "RestDaysList9"                               | (?)                                   |                                      |
| "RestDaysList10"                              | (?)                                   |                                      |
| "RestDaysList11"                              | (?)                                   |                                      |
| "RestDaysList12"                              | (?)                                   |                                      |
| "RestTimeList1"                               | (?)                                   |                                      |
| "RestTimeList2"                               | (?)                                   |                                      |
| "RestTimeList3"                               | (?)                                   |                                      |
| "RestTimeList4"                               | (?)                                   |                                      |
| "RestTimeList5"                               | (?)                                   |                                      |
| "RestTimeList6"                               | (?)                                   |                                      |
| "RestTimeList7"                               | (?)                                   |                                      |
| "RestTimeList8"                               | (?)                                   |                                      |
| "RestTimeList9"                               | (?)                                   |                                      |
| "RestTimeList10"                              | (?)                                   |                                      |
| "RestTimeList11"                              | (?)                                   |                                      |
| "RestTimeList12"                              | (?)                                   |                                      |
| "TotalOverTimeItemNameList1"                  | (?)                                   |                                      |
| "TotalOverTimeItemNameList2"                  | (?)                                   |                                      |
| "TotalOverTimeItemList1"                      | (?)                                   |                                      |
| "TotalOverTimeItemList2"                      | (?)                                   |                                      |
| "Val"                                         | (?)                                   | true                                 |
| "WorkerTaskModelList_Stamp"                   | (?)                                   |                                      |
| "AppliedDivision"                             | (?)                                   | Overtime                             |
| "TaskID"                                      | (?)                                   | 00000000-0000-0000-0000-000000000000 |
| "Comment"                                     | (?)                                   |                                      |
| "IsAlreadyIncorrectApplyChecked"              | (?)                                   | false                                |
| "ByIncorrectApply"                            | (?)                                   | False                                |
| "ByTemporarySavedApplicationForm"             | (?)                                   | False                                |
| "CtrlId"                                      | (?)                                   |                                      |
