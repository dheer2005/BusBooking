import { PassengerDTO } from "./passenger.dto";

export interface BookingDTO {
  UserId:                number;
  ScheduleId:            number;
  BusBookingPassengers:  PassengerDTO[];
}