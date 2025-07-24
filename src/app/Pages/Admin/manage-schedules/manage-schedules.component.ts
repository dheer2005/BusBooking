import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ScheduleDTO } from 'src/app/DTO/schedule.dto';
import { Bus } from 'src/app/Models/bus.model';
import { LocationModel } from 'src/app/Models/locationModel.model';
import { Schedule } from 'src/app/Models/schedule.model';
import { MasterService } from 'src/app/Service/master.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manage-schedules',
  templateUrl: './manage-schedules.component.html',
  styleUrls: ['./manage-schedules.component.css']
})
export class ManageSchedulesComponent implements OnInit {

  schedules: Schedule[] = [];
  buses: Bus[] = [];
  locations: LocationModel[] = [];
  arrivalDate!: string | Date;
  minDate: string = new Date().toISOString().split('T')[0];

  get arrivalMinDate() { return this.dto.travelDate.toString().split('T')[0]};

  dto: ScheduleDTO = {
    busId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    travelDate: new Date(),
    departureTime: new Date(),
    arrivalTime: new Date()
  };

  editing: ScheduleDTO & { scheduleId?: number } = {
    scheduleId: 0,
    busId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    travelDate: '',
    departureTime: '',
    arrivalTime: ''
  };

  private resetDto() {
    this.arrivalDate = '';
    this.dto = {
      busId: 0,
      fromLocationId: 0,
      toLocationId: 0,
      travelDate: new Date(),
      departureTime: new Date(),
      arrivalTime: new Date()
    };
  }

  editModal!: any;
  showDeleteModal = false;
  showSpinner = true;
  deleteId?: number;
  states: string[] = [];
  districts: string[] = [];
  cities: string[] = [];

  selectedState: string = '';
  selectedDistrict: string = '';
  selectedCity: string = '';
  

  constructor(private ms: MasterService, private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadStates();
    const modalEl = document.getElementById('editSchModal');
    if (modalEl) {
      this.editModal = new bootstrap.Modal(modalEl);
    }
  }

  loadAll() {
    this.ms.getSchedules().subscribe({
      next: (res: Schedule[]) => {
        this.showSpinner = false;
        this.schedules = res;
      },
      error: err => this.toastrSvc.error('Error loading schedules:', `${err}`)
    });

    this.ms.getBuses().subscribe({
      next: (res: Bus[]) => this.buses = res,
      error: err => this.toastrSvc.error('Error loading buses:', `${err}`)
    });

    this.ms.getLocations().subscribe({
      next: (res: LocationModel[]) => this.locations = res.sort((a,b)=>a.locationName.localeCompare(b.locationName)),
      error: err => this.toastrSvc.error('Error loading locations:', `${err}`)
    });
  }

  loadStates() {
    this.ms.getStates().subscribe(res => {
      this.states = res;
    });
  }

  onStateChange() {
    this.districts = [];
    this.cities = [];
    this.selectedDistrict = '';
    this.selectedCity = '';
    this.ms.getDistricts(this.selectedState).subscribe(res => this.districts = res);
  }

  onDistrictChange() {
    this.cities = [];
    this.selectedCity = '';
    this.ms.getCities(this.selectedState, this.selectedDistrict).subscribe(res => this.cities = res);
  }

  addLocation() {
    const newLocation = {
      locationName: `${this.selectedCity}`
    };
    this.ms.addLocation(newLocation).subscribe(() => {
      this.loadAll();
      this.toastrSvc.success("New Location added successfully.", "Location");
      this.selectedState = '';
      this.selectedDistrict = '';
      this.selectedCity = '';
    });
  }

  addSchedule() {
    this.dto = {
      ...this.dto,
      travelDate: new Date(new Date(this.dto.travelDate).getTime()+19800000),
      arrivalTime: new Date(new Date(`${this.arrivalDate}T${this.dto.arrivalTime}`).getTime()+19800000),
      departureTime: new Date(new Date(`${this.dto.travelDate}T${this.dto.departureTime}`).getTime()+19800000)
    }
    this.ms.addSchedule(this.dto).subscribe(() => {
      this.toastrSvc.success("New Schedule created successfully", "Schedule");
      this.loadAll();
      this.resetDto();
    });
  }

  openEditModal(s: Schedule) {
    this.editing = {
      scheduleId: s.scheduleId,
      busId: s.busId,
      fromLocationId: s.fromLocationId,
      toLocationId: s.toLocationId,
      travelDate: s.travelDate.slice(0,10),
      departureTime: s.departureTime,
      arrivalTime: s.arrivalTime
    };
    this.editModal.show();
  }

  updateSchedule() {
    this.editing = {
      ...this.editing,
      travelDate: new Date(new Date(this.editing.travelDate).getTime()+19800000),
      arrivalTime: new Date(new Date(`${this.editing.arrivalTime}`).getTime()+19800000),
      departureTime: new Date(new Date(`${this.editing.departureTime}`).getTime()+19800000)
    }
    this.ms.updateSchedule(this.editing.scheduleId!, this.editing).subscribe(() => {
      this.toastrSvc.success("Schedule updated successfully", "Schedule");
      this.loadAll();
      this.editModal.hide();
    });
  }

  openDeleteModal(id: number) {
    this.showDeleteModal = true;
    this.deleteId = id;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteId = undefined;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    this.ms.deleteSchedule(this.deleteId!).subscribe({
      next: () => {
        this.toastrSvc.error('Schedule deleted successfully','Schedule');
        this.loadAll();  
        this.deleteId = undefined;
      },
      error: err => this.toastrSvc.error('Delete failed: ', `${err}`)
    });
  }


}

