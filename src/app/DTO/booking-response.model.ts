import { PassengerDTO } from "./passenger.dto";

export interface BookingResponseDTO {
  bookingId: number;
  bookingDate: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  scheduleId: number;
  busId: number;
  busName: string;
  from: string;
  to: string;
  totalAmount: number;
  isCompleted: boolean;
  hasRated: boolean;
  passengers: PassengerDTO[];
}

