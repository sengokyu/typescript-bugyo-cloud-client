import { OvertimeInfo } from "../models/overtime-info";

export const OvertimeInfo2FormData = (src: OvertimeInfo): FormData => {
  const dst = new FormData();

  dst.append("applyReasonRadios", "0");
  dst.append("applyUnitRadios", "0");

  dst.append("js-application__basicDate", "2024/3/22 ::");
  dst.append("js-application__endDate", "2024/03/27 ::");

  dst.append("js-application__startTime.TimeBoxDateType", "1");
  dst.append("js-application__startTime.Hour", "18");
  dst.append("js-application__startTime.Minute", "00");
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "View_24hour");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__endTime.TimeBoxDateType", "1");
  dst.append("js-application__endTime.Hour", "22");
  dst.append("js-application__endTime.Minute", "00");
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "View_24hour");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__punchMarkStartDate", "2024/3/22 0:0:0");
  dst.append("js-application__startTimeWith.Hour", null);
  dst.append("js-application__startTimeWith.Minute", null);
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "Normal");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__punchMarkEndDate", "2024/3/22 0:0:0");
  dst.append("js-application__endTimeWith.Hour", null);
  dst.append("js-application__endTimeWith.Minute", null);
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "Normal");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__startTimeFor.Hour", null);
  dst.append("js-application__startTimeFor.Minute", null);
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "Normal");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__endTimeFor.Hour", null);
  dst.append("js-application__endTimeFor.Minute", null);
  dst.append("TimeBoxInfo.IsBorder", "value");
  dst.append("TimeBoxInfo.HourViewType", "Normal");
  dst.append("TimeBoxInfo.NavigationType", "Separation");

  dst.append("js-application__calcSpanDate", ":");
  dst.append("js-application__calcSpanDateHour", "0");
  dst.append("js-application__calcSpanPeriod", "4:00");
  dst.append("js-application__calcSpanPeriodHour", "0");

  dst.append("Details[0].ReasonIndex", "0");
  dst.append("Details[0].ApplyUnit", "0");
  dst.append("Details[0].BasicDate", "2024/3/22");
  dst.append("Details[0].StartDate", null);
  dst.append("Details[0].EndDate", null);
  dst.append("Details[0].StartTime", "18:00");
  dst.append("Details[0].EndTime", "22:00");
  dst.append("Details[0].SpanDay", null);
  dst.append("Details[0].ClockType", null);
  dst.append("Details[0].MultiLaborTime", null);
  dst.append("Details[0].PunchMarkTime", null);
  dst.append("Details[0].CalcSpan", "4 時間 00 分");
  dst.append("Details[0].AttendanceHoliday1", null);
  dst.append("Details[0].AttendanceHoliday2", null);
  dst.append("Details[0].AttendanceHoliday3", null);
  dst.append("Details[0].AttendanceHoliday4", null);
  dst.append("Details[0].AttendanceHoliday5", null);
  dst.append("Details[0].ByteDoCompDay", "0");
  dst.append("Details[0].CompDayBasicDate", null);
  dst.append("Details[0].CompDayStartDate", null);
  dst.append("Details[0].CompDayStartTime", null);
  dst.append("Details[0].CompDayEndDate", null);
  dst.append("Details[0].CompDayEndTime", null);
  dst.append("Details[0].CompDaySpanDay", null);
  dst.append("Details[0].CompDayCalcSpan", null);
  dst.append("Details[0].InitialApplylNo", null);
  dst.append("Details[0].InitialApplyNo", null);
  
  dst.append("CommuteRoute", null);
  dst.append("Cause", src.cause);
  dst.append("Address", null);
  dst.append("Memo", null);
  dst.append("AttachedFileCount", "0");
  dst.append("WorkflowName", null);
  dst.append("WorkflowID", null);
  dst.append("ApplicationPositionCount", null);
  dst.append("ApplicationPositionName", null);
  dst.append("RestDaysNameList1", null);
  dst.append("RestDaysNameList2", null);
  dst.append("RestDaysNameList3", null);
  dst.append("RestDaysNameList4", null);
  dst.append("RestDaysNameList5", null);
  dst.append("RestDaysNameList6", null);
  dst.append("RestDaysNameList7", null);
  dst.append("RestDaysNameList8", null);
  dst.append("RestDaysNameList9", null);
  dst.append("RestDaysNameList10", null);
  dst.append("RestDaysNameList11", null);
  dst.append("RestDaysNameList12", null);
  dst.append("RestDaysList1", null);
  dst.append("RestDaysList2", null);
  dst.append("RestDaysList3", null);
  dst.append("RestDaysList4", null);
  dst.append("RestDaysList5", null);
  dst.append("RestDaysList6", null);
  dst.append("RestDaysList7", null);
  dst.append("RestDaysList8", null);
  dst.append("RestDaysList9", null);
  dst.append("RestDaysList10", null);
  dst.append("RestDaysList11", null);
  dst.append("RestDaysList12", null);
  dst.append("RestTimeList1", null);
  dst.append("RestTimeList2", null);
  dst.append("RestTimeList3", null);
  dst.append("RestTimeList4", null);
  dst.append("RestTimeList5", null);
  dst.append("RestTimeList6", null);
  dst.append("RestTimeList7", null);
  dst.append("RestTimeList8", null);
  dst.append("RestTimeList9", null);
  dst.append("RestTimeList10", null);
  dst.append("RestTimeList11", null);
  dst.append("RestTimeList12", null);
  dst.append("TotalOverTimeItemNameList1", null);
  dst.append("TotalOverTimeItemNameList2", null);
  dst.append("TotalOverTimeItemList1", null);
  dst.append("TotalOverTimeItemList2", null);
  dst.append("Val", "true");
  dst.append("WorkerTaskModelList_Stamp", null);
  dst.append("AppliedDivision", "Overtime");
  dst.append("TaskID", "00000000-0000-0000-0000-000000000000");
  dst.append("Comment", null);
  dst.append("IsAlreadyIncorrectApplyChecked", "false");
  dst.append("ByIncorrectApply", "False");
  dst.append("ByTemporarySavedApplicationForm", "False");
  dst.append("CtrlId", null);

  return dst;
};

/*
| Form data name| Form data description| Sample value|
| :-------------------------------------------- | :------------------------------------ | :----------------------------------- |
| "\_\_RequestVerificationToken"| Input hidden value at the form screen | (snip)|
| "applyReasonRadios"| Detail 1 radio value| 0|
| "applyUnitRadios"| (?)| 0|
| "js-application\_\_basicDate"| Detail 1 target date(?)| 2024/3/22 ::|
| "js-application\_\_endDate"| Detail 1 input date(?)| 2024/03/27 ::|
| "js-application\_\_startTime.TimeBoxDateType" | (?)| 1|
| "js-application\_\_startTime.Hour"| Detail 1 start time (hour)| 18|
| "js-application\_\_startTime.Minute"| Detail 1 start time (minute)| 00|
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| View_24hour|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_endTime.TimeBoxDateType"| (?)| 1|
| "js-application\_\_endTime.Hour"| Detail 1 end time (hour)| 22|
| "js-application\_\_endTime.Minute"| Detail 1 end time (minute)| 00|
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| View_24hour|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_punchMarkStartDate"| Detail 1 target date (?)| 2024/3/22 0:0:0|
| "js-application\_\_startTimeWith.Hour"| (?)||
| "js-application\_\_startTimeWith.Minute"| (?)||
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| Normal|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_punchMarkEndDate"| Detail 1 target date (?)| 2024/3/22 0:0:0|
| "js-application\_\_endTimeWith.Hour"| (?)||
| "js-application\_\_endTimeWith.Minute"| (?)||
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| Normal|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_startTimeFor.Hour"| (?)||
| "js-application\_\_startTimeFor.Minute"| (?)||
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| Normal|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_endTimeFor.Hour"| (?)||
| "js-application\_\_endTimeFor.Minute"| (?)||
| "TimeBoxInfo.IsBorder"| (?)| value|
| "TimeBoxInfo.HourViewType"| (?)| Normal|
| "TimeBoxInfo.NavigationType"| (?)| Separation|
| "js-application\_\_calcSpanDate"| (?)| :|
| "js-application\_\_calcSpanDateHour"| (?)| 0|
| "js-application\_\_calcSpanPeriod"| Detail 1 calclated span| 4:00|
| "js-application\_\_calcSpanPeriodHour"| (?)| 0|
| "attachedFile"| attached file||
| "Details[0].ReasonIndex"| Detail 1 index number| 0|
| "Details[0].ApplyUnit"| (?)| 0|
| "Details[0].BasicDate"| Detail 1 target date| 2024/3/22|
| "Details[0].StartDate"| (?)||
| "Details[0].EndDate"| (?)||
| "Details[0].StartTime"| Detail 1 start time| 18:00|
| "Details[0].EndTime"| Detail 1 end time| 22:00|
| "Details[0].SpanDay"| (?)||
| "Details[0].ClockType"| (?)||
| "Details[0].MultiLaborTime"| (?)||
| "Details[0].PunchMarkTime"| (?)||
| "Details[0].CalcSpan"| Detail 1 calclated span| 4 時間 00 分|
| "Details[0].AttendanceHoliday1"| (?)||
| "Details[0].AttendanceHoliday2"| (?)||
| "Details[0].AttendanceHoliday3"| (?)||
| "Details[0].AttendanceHoliday4"| (?)||
| "Details[0].AttendanceHoliday5"| (?)||
| "Details[0].ByteDoCompDay"| (?)| 0|
| "Details[0].CompDayBasicDate"| (?)||
| "Details[0].CompDayStartDate"| (?)||
| "Details[0].CompDayStartTime"| (?)||
| "Details[0].CompDayEndDate"| (?)||
| "Details[0].CompDayEndTime"| (?)||
| "Details[0].CompDaySpanDay"| (?)||
| "Details[0].CompDayCalcSpan"| (?)||
| "Details[0].InitialApplylNo"| (?)||
| "Details[0].InitialApplyNo"| (?)||
| "CommuteRoute"| (?)||
| "Cause"| 事由| 作業のため|
| "Address"| (?)||
| "Memo"| (?)||
| "AttachedFileCount"| (?)| 0|
| "WorkflowName"| (?)||
| "WorkflowID"| (?)||
| "ApplicationPositionCount"| (?)||
| "ApplicationPositionName"| (?)||
| "RestDaysNameList1"| (?)||
| "RestDaysNameList2"| (?)||
| "RestDaysNameList3"| (?)||
| "RestDaysNameList4"| (?)||
| "RestDaysNameList5"| (?)||
| "RestDaysNameList6"| (?)||
| "RestDaysNameList7"| (?)||
| "RestDaysNameList8"| (?)||
| "RestDaysNameList9"| (?)||
| "RestDaysNameList10"| (?)||
| "RestDaysNameList11"| (?)||
| "RestDaysNameList12"| (?)||
| "RestDaysList1"| (?)||
| "RestDaysList2"| (?)||
| "RestDaysList3"| (?)||
| "RestDaysList4"| (?)||
| "RestDaysList5"| (?)||
| "RestDaysList6"| (?)||
| "RestDaysList7"| (?)||
| "RestDaysList8"| (?)||
| "RestDaysList9"| (?)||
| "RestDaysList10"| (?)||
| "RestDaysList11"| (?)||
| "RestDaysList12"| (?)||
| "RestTimeList1"| (?)||
| "RestTimeList2"| (?)||
| "RestTimeList3"| (?)||
| "RestTimeList4"| (?)||
| "RestTimeList5"| (?)||
| "RestTimeList6"| (?)||
| "RestTimeList7"| (?)||
| "RestTimeList8"| (?)||
| "RestTimeList9"| (?)||
| "RestTimeList10"| (?)||
| "RestTimeList11"| (?)||
| "RestTimeList12"| (?)||
| "TotalOverTimeItemNameList1"| (?)||
| "TotalOverTimeItemNameList2"| (?)||
| "TotalOverTimeItemList1"| (?)||
| "TotalOverTimeItemList2"| (?)||
| "Val"| (?)| true|
| "WorkerTaskModelList_Stamp"| (?)||
| "AppliedDivision"| (?)| Overtime|
| "TaskID"| (?)| 00000000-0000-0000-0000-000000000000 |
| "Comment"| (?)||
| "IsAlreadyIncorrectApplyChecked"| (?)| false|
| "ByIncorrectApply"| (?)| False|
| "ByTemporarySavedApplicationForm"| (?)| False|
| "CtrlId"| (?)||
*/
