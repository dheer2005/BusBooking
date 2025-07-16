import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {

  bookings: any[] = [];
  showSpinner = true;

  constructor(private ms: MasterService, private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    this.ms.getAllBookings().subscribe({
      next: (res:any)=>{
        this.showSpinner = false;
        this.bookings = res;
      },
      error: (err:any)=>{
        this.toastrSvc.error("errors: ", `${err}`);
      }
    });
  }

  
}
