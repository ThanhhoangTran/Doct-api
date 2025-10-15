export type OverlapScheduleTimingEventValidatorInput = {
  startTime: Date;
  endTime: Date;
  userId: string;
  excludeTimeOpeningIds?: string[];
};
