import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterService } from 'src/app/Service/master.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  locations$: Observable<any[]> = new Observable<any[]>();
  masterSrv = inject(MasterService);
  busList: any[] = [];
  emptyBusList: boolean = false;
  showSpinner = false;
  minDate: string = new Date().toISOString().split('T')[0];

  serachObj = {
    fromLocation: '',
    toLocation: '',
    travelDate: ''
  };

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locations$ = this.masterSrv.getLocations();
  }

  onSearch() {
    this.showSpinner = true;
    const { fromLocation, toLocation, travelDate } = this.serachObj;
    if (!fromLocation || !toLocation || !travelDate) {
      alert('Please select all fields');
      return;
    }

    this.masterSrv.serachBus(fromLocation, toLocation, travelDate).subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.busList = res;
        if(this.busList.length === 0){
          this.emptyBusList = true;
        }
      },
      error: (err) => console.error('Search failed', err)
    });
  }

  isBookingAllowed(departureTimeStr: string): boolean {
    const now = new Date();
    const departureTime = new Date(departureTimeStr);
    return departureTime > now;
  }
}
