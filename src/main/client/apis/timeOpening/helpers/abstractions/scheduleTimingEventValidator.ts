export interface ScheduleTimingEventValidator {
  validateOverlapTimingEvent: (input: { startTime: Date; endTime: Date; userId: string; excludeTimeOpeningIds?: string[] }) => Promise<void>;
}
