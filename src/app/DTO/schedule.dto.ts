export interface ScheduleDTO {
  scheduleId?: number;
  busId: number;
  fromLocationId: number;
  toLocationId: number;
  travelDate: string | Date;
  departureTime: string | Date;
  arrivalTime: string | Date;
}