import { Passenger } from "./passenger.model";

export interface Booking {
  BookingId:            number;
  CustId:               number;
  ScheduleId:           number;
  BookingDate:          string;
  BusBookingPassengers: Passenger[];
}