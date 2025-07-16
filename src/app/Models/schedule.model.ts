export interface Schedule {
  scheduleId: number;
  busId: number;
  fromLocationId: number;
  toLocationId: number;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  busName: string;
  fromLocation?: string;
  toLocation?: string;
}