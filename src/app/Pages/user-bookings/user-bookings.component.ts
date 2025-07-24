import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingResponseDTO } from 'src/app/DTO/booking-response.model';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css'],
})
export class UserBookingsComponent implements OnInit {
  userBookings: BookingResponseDTO[] = [];
  groupedBookings: any[] = [];
  filters = {
    travelDate: '',
    busName: '',
  };
  showSpinner = true;


  constructor(private masterService: MasterService, private router: Router, private toastrSvc: ToastrService) {

  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('redBusUser')!);
    if (user && user.userId) {
      this.masterService.getUserBookings(user.userId).subscribe({
        next: (res) => {
          this.showSpinner = false;
          this.userBookings = res.map((bookings: any) => {
            bookings.bookingDate = new Date(new Date(bookings.bookingDate).getTime() + 19800000);
            bookings.travelDate = new Date(bookings.travelDate);
            bookings.departureTime = new Date(bookings.departureTime);
            bookings.arrivalTime = new Date(bookings.arrivalTime);
            return bookings;
          });
          this.userBookings.sort((a, b) => {
            return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
          });
        },
        error: (err) => this.toastrSvc.error('Failed to fetch bookings', `${err}`)
      });
    } else{
      this.toastrSvc.warning("You have to login first", "Invalid");
      this.router.navigateByUrl('search');
    }
  }


  resetFilters() {
    this.filters = {
      travelDate: '',
      busName: ''
    };
  }

  get filteredBookings(): BookingResponseDTO[] {
    return this.userBookings.filter(b => {
      const matchesDate = this.filters.travelDate
        ? new Date(b.travelDate).toISOString().split('T')[0] === this.filters.travelDate
        : true;

      const matchesBus = this.filters.busName
        ? b.busName.toLowerCase().includes(this.filters.busName.toLowerCase())
        : true;

      return matchesDate && matchesBus;
    }).sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }


  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.masterService.cancelBooking(id).subscribe({
        next: () => {
          this.toastrSvc.success('Booking cancelled','Booking');
          this.userBookings = this.userBookings.filter(b => b.bookingId !== id);
        },
        error: (err) => alert(err.error)
      });
    }
  }

  downloadTicket(bookingId: number){
    this.masterService.downloadTicket(bookingId).subscribe(blob=>{
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Ticket_${bookingId}.pdf`;
      link.click();
    },
    err=>{
      this.toastrSvc.error('Failed to download ticket.', 'Error');
    }
  )
  }

  rateBus(booking: BookingResponseDTO) {
    this.router.navigate(['/rate-bus'], {
      queryParams: {
        bookingId: booking.bookingId,
        busId: booking.busId,
        busName: booking.busName
      }
    });
  }

  isBookingAllowed(departureTimeStr: string): boolean {
    const now = new Date();
    const departureTime = new Date(departureTimeStr);
    return departureTime > now;
  }
}
