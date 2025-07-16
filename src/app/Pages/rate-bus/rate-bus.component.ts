import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-rate-bus',
  templateUrl: './rate-bus.component.html',
  styleUrls: ['./rate-bus.component.css']
})
export class RateBusComponent implements OnInit {
  bookingId!: number;
  busId!: number;
  busName!: string;
  showModal = false;

  formData = {
    rating: 0,
    comments: '',
    userId: 0,
    busId: 0,
    bookingId: 0
  };

  constructor(private route: ActivatedRoute, private masterSrv: MasterService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('redBusUser')!);
    this.route.queryParams.subscribe(params => {
      this.busId = +params['busId'];
      this.busName = params['busName'];
      this.bookingId = +params['bookingId'];
      this.formData.busId = this.busId;
      this.formData.userId = user.userId;
      this.formData.bookingId = this.bookingId;
    });
  }

  submit(form: NgForm) {
    if (form.invalid) return;
    console.log("rating data", this.formData);
    this.masterSrv.submitRating(this.formData).subscribe({
      next: () => {
        this.showModal = true;
        form.resetForm();
        
      },
      error: (err: any) => {
        alert(`Feedback submission failed ${err}`);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigateByUrl('my-bookings');
  }
}
