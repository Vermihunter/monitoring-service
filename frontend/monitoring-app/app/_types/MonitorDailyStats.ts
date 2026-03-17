export default interface MonitorDailyStat {
  responseTimeAvg: number;
  responseTimeCount: number;
  responseTimeMin: number;
  responseTimeMax: number;
  responseTimeSum: number;
  successCount: number;
  failureCount: number;
  day: Date;
  monitorId: string;
}
