import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentDTO } from '../DTO/payment.dto';
import { RazorpayResponse } from '../DTO/razorpayResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // apiUrl = `https://localhost:7044/api`;
  apiUrl = `https://BusBooking001.bsite.net/api`;

  constructor(private http: HttpClient) { }

  createOrder(amount:number){
    return this.http.post(`${this.apiUrl}/Payment/createOrder`, { amount });
  }

  verifyPayment(obj:any){
    return this.http.post(`${this.apiUrl}/Payment/verify-payment`, obj);
  }

  savePayment(dto: PaymentDTO){
    return this.http.post(`${this.apiUrl}/Payment/save-payment`, dto);
  }
}
