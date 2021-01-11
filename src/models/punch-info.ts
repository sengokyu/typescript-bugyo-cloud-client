export type ClockType = "ClockIn" | "ClockOut";

/**
 * 打刻情報
 */
export interface PunchInfo {
  clockType: ClockType;
  latitude?: number;
  longitude?: number;
}
