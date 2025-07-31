import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BookingResponseDTO } from '../DTO/booking-response.model';
import { Bus } from '../Models/bus.model';
import { BusDTO } from '../DTO/bus.dto';
import { Schedule } from '../Models/schedule.model';
import { ScheduleDTO } from '../DTO/schedule.dto';
import { PaymentDTO } from '../DTO/payment.dto';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  // apiURl: string = 'https://localhost:7044/api';
  apiURl: string = 'https://BusBooking001.bsite.net/';


  constructor(private http: HttpClient) { }

  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURl}/Schedule/GetBusLocations`);
  }

  serachBus(fromLocation: string, toLocation: string, travelDate: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiURl}/Schedule/Search?fromLocation=${fromLocation}&toLocation=${toLocation}&travelDate=${travelDate}`
    );
  }

  getScehduelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURl}/Schedule/${id}`);
  }

  getBookedSeats(scheduleId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiURl}/Booking/GetBookedSeats?scheduleId=${scheduleId}`);
  }

  onRegisterUser(obj: any): Observable<any> {
    return this.http.post<any>(`${this.apiURl}/User/Register`, obj);
  }

  loginUser(obj: any): Observable<any> {
    return this.http.post<any>(`${this.apiURl}/User/Login`, obj);
  }

  onBooking(obj: any): Observable<any> {
    return this.http.post<any>(`${this.apiURl}/Booking`, obj);
  }

  getUserBookings(userId: number) {
    return this.http.get<BookingResponseDTO[]>(`https://localhost:7044/api/Booking/User/${userId}`);
  }

  getBuses() {
    return this.http.get<Bus[]>(`${this.apiURl}/Admin/buses`);
  }

  addBus(dto: BusDTO) {
    return this.http.post<Bus>(`${this.apiURl}/Admin/bus`, dto);
  }

  updateBus(id: number, dto: BusDTO) {
    return this.http.put<Bus>(`${this.apiURl}/Admin/bus/${id}`, dto);
  }

  deleteBus(id: number) {
    return this.http.delete(`${this.apiURl}/Admin/bus/${id}`);
  }

  getSchedules() {
    return this.http.get<Schedule[]>(`${this.apiURl}/Admin/schedules`);
  }

  addSchedule(dto: ScheduleDTO) {
    return this.http.post<Schedule>(`${this.apiURl}/Admin/schedule`, dto);
  }

  updateSchedule(id: number, dto: ScheduleDTO) {
    return this.http.put<Schedule>(`${this.apiURl}/Admin/schedule/${id}`, dto);
  }

  deleteSchedule(id: number) {
    return this.http.delete(`${this.apiURl}/Admin/schedule/${id}`);
  }

  getAllBookings() {
    return this.http.get<any[]>(`${this.apiURl}/Admin/bookings`);
  }

  getStats() {
    return this.http.get<{ TotalUsers: number; TotalBuses: number; TotalBookings: number; TotalPassengers: number }>(
      `${this.apiURl}/Admin/stats`
    );
  }

  cancelBooking(id:number){
    return this.http.delete(`${this.apiURl}/Booking/cancelBooking/${id}`);
  }

  getTopFiveRevenueBuses(){
    return this.http.get<any[]>(`${this.apiURl}/Admin/dashboard/topFiveRevenuebuses`);
  }

  getLeastFiveRevenueBuses(){
    return this.http.get<any[]>(`${this.apiURl}/Admin/dashboard/leastFiveRevenueBuses`);
  }

  getTopLovedBuses(){
    return this.http.get<any[]>(`${this.apiURl}/Admin/dashboard/top-loved-buses`);
  }

  getTopBuses() {
    return this.http.get<any[]>(`${this.apiURl}/Admin/dashboard/top-buses`);
  }

  submitRating(payload: any) {
    return this.http.post(`${this.apiURl}/Bus/AddBusRating`, payload);
  }

  getBusRatings(busId: number){
    return this.http.get(`${this.apiURl}/Bus/GetBusRatings/{busId}`);
  }

  getStates() {
    return this.http.get<string[]>(`${this.apiURl}/location/states`);
  }

  getDistricts(state: string) {
    return this.http.get<string[]>(`${this.apiURl}/location/districts/${state}`);
  }

  getCities(state: string, district: string) {
    return this.http.get<string[]>(`${this.apiURl}/location/cities/${state}/${district}`);
  }

  addLocation(location: { locationName: string }) {
    return this.http.post(`${this.apiURl}/location`, location);
  }

  getLocationCities() {
    return this.http.get<string[]>(`${this.apiURl}/location/location-cities`);
  }

  downloadTicket(bookingId: number) {
    return this.http.get(`${this.apiURl}/Booking/ticket/${bookingId}`, {
      responseType: 'blob'
    });
  }

  getCoordinates(locationName: string): Observable<[number, number]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`;
    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (!results || results.length === 0) {
          throw new Error(`No results found for location: ${locationName}`);
        }
        const location = results[0];
        return [parseFloat(location.lat), parseFloat(location.lon)];
      })
    );
  }

}
