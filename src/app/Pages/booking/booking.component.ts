import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentDTO } from 'src/app/DTO/payment.dto';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  scheduleId = 0;
  scehduelData!: any;
  seatArray: number[] = [];
  bookedSeatsArray: number[] = [];
  userSelectedSeatArray: any[] = [];
  seatRows: number[][] = [];
  showSpinner = true;

  router = inject(Router);

  constructor(private route: ActivatedRoute, private masterSrv: MasterService, private toastrSvc: ToastrService) {
    this.route.params.subscribe((res: any) => {
      this.scheduleId = +res.id;
      this.loadSchedule();
      this.loadBookedSeats();
    });
  }

  chunkSeats(seats: number[], chunkSize: number = 4) {
    const result: number[][] = [];
    for (let i = 0; i < seats.length; i += chunkSize) {
      result.push(seats.slice(i, i + chunkSize));
    }
    return result;
  }

  loadSchedule() {
    this.masterSrv.getScehduelById(this.scheduleId).subscribe((res) => {
      this.scehduelData = res;
      const totalSeats = res.totalSeats; 
      this.showSpinner = false;
      this.seatArray = Array.from({ length: totalSeats }, (_, i) => i + 1);
      this.seatRows = this.chunkSeats(this.seatArray, 4);
    });
  }

  loadBookedSeats() {
    this.masterSrv.getBookedSeats(this.scheduleId).subscribe((res) => {
      this.bookedSeatsArray = res;
    });
  }

  checkIfSeatBooked(seatNo: number): boolean {
    return this.bookedSeatsArray.includes(seatNo);
  }

  selectSeat(seatNo: number) {
    const selectedIndex = this.userSelectedSeatArray.findIndex((p) => p.seatNo === seatNo);
    if (selectedIndex !== -1) {
      this.userSelectedSeatArray.splice(selectedIndex, 1);
    } else if (!this.checkIfSeatBooked(seatNo)) {
      this.userSelectedSeatArray.push({
        passengerName: '',
        age: null,
        gender: '',
        seatNo: seatNo
      });
    }
  }

  checkIsSeatSelected(num: number) {
    return this.userSelectedSeatArray.findIndex((p) => p.seatNo === num);
  }

  proceedToCheckout() {
    for (let p of this.userSelectedSeatArray) {
      if (!p.passengerName || !p.age || !p.gender) {
        this.toastrSvc.warning("Please fill all passenger details.","Invalid");
        return;
      }
    }
    if (!this.userSelectedSeatArray.length) {
      this.toastrSvc.warning('Select seats first','Invalid');
      return;
    }

    const user = JSON.parse(localStorage.getItem('redBusUser')!);
    if (!user) {
      this.toastrSvc.warning('Login required','Invalid');
      return;
    }

    this.router.navigate(['/checkout'], {
      queryParams: {
        scheduleId: this.scheduleId,
        userId: user.userId,
        seats: JSON.stringify(this.userSelectedSeatArray)
      }
    });
  }

  ngOnInit(): void {}

}
