import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentDTO } from 'src/app/DTO/payment.dto';
import { RazorpayResponse } from 'src/app/DTO/razorpayResponse.dto';
import { MasterService } from 'src/app/Service/master.service';
import { PaymentService } from 'src/app/Service/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  scheduleId!: number;
  seats: number[] = [];
  passengers: any[] = [];
  userId!: number;
  amount!: number;
  pricePerSeat!: number;
  isPaying = false;

  constructor(private route: ActivatedRoute, private masterSrv: MasterService, private paymentSrv:PaymentService, private router: Router, private toastrSvc: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.scheduleId = +params['scheduleId'];
      this.userId     = +params['userId'];
      this.passengers = JSON.parse(params['seats']);
      this.seats = this.passengers.map(p => p.seatNo);

      this.masterSrv.getScehduelById(this.scheduleId).subscribe(res => {
        this.pricePerSeat = res.price;
        this.amount = res.price * this.seats.length;
      });
    });
  }

  pay() {
    if(this.isPaying) return;
    this.isPaying = true;
    
    this.paymentSrv.createOrder(this.amount).subscribe((order:any) => {
      const options = {
        key: "rzp_test_X3Lg7L57herVXe",
        amount: order.amount,
        currency: order.currency,
        name: "BusBooking",
        order_id: order.orderId,
        handler: (response: RazorpayResponse) => this.handlePaymentSuccess(response),
        prefill: {
          name: "Test1",
          email: "test@gmail.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            this.toastrSvc.error('Payment cancelled by user.', 'Payment');
            this.isPaying = false;
          }
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }


  private handlePaymentSuccess(response: RazorpayResponse) {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    };

    this.paymentSrv.verifyPayment(payload).subscribe({
      next: () => this.bookSeats(response),
      error: err => {
        this.toastrSvc.error('Payment verification failed', 'Payment');
        console.error(err);
        this.isPaying = false;
      }
    });
  }

   private bookSeats(response: RazorpayResponse) {
    const payload = {
      userId: this.userId,
      scheduleId: this.scheduleId,
      busBookingPassengers: this.passengers
    };

    this.masterSrv.onBooking(payload).subscribe({
      next: (bookingRes:any) => {
        const paymentPayload: PaymentDTO = {
          BookingId: bookingRes.bookingId,
          Amount: this.amount,
          PaymentMethod: 'Razorpay',
          PaymentStatus: 'Success',
          PaymentDate: new Date(),
          RazorpayPaymentId: response.razorpay_payment_id,
          RazorpayOrderId: response.razorpay_order_id,
          RazorpaySignature: response.razorpay_signature
        };
        this.paymentSrv.savePayment(paymentPayload).subscribe({
          next: () => {
            this.toastrSvc.success('Booking and Payment Successful!', 'Payment');
            this.router.navigate(['/my-bookings']).then(()=>location.reload());
          },
          error: (err) => {
            this.toastrSvc.error('Payment save failed.', 'Payment');
            console.error(err);
            this.isPaying = false;
          }
        });
      },
      error: err => {
        this.toastrSvc.error(`${err}`, `Booking failed, Please contact support`);
        this.isPaying = false;
      }
    });
  }

}
