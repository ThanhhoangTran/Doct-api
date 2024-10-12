import { TimeOpening } from '../../../../../../db/entities/timeOpening.entity';

export interface GetAvailableTimeOpeningHelper {
  execute: (timeOpening: TimeOpening) => { formattedDate: string; availableAppointments: any[]; availableMeetings: any[]; availableOperations: any[] };
}
