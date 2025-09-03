/**
 * 時間外申請
 */
export interface OvertimeInfo {
  // 開始時刻
  startDateTime: Date;
  // 終了時刻
  endEndTime: Date;
  // 期間（endTime - startTime） hh:mm 形式
  duration: string;
  // 事由
  cause: string;
}
