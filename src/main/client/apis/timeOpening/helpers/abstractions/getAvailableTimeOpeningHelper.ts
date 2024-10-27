import { TimeOpening } from '../../../../../../entities/timeOpening.entity';

export interface GetAvailableTimeOpeningHelper {
  execute: (timeOpening: TimeOpening) => { availableAppointments: any[]; availableMeetings: any[]; availableOperations: any[] };
}
