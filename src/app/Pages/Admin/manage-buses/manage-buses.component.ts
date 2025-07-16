import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BusDTO } from 'src/app/DTO/bus.dto';
import { Bus } from 'src/app/Models/bus.model';
import { MasterService } from 'src/app/Service/master.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.css']
})
export class ManageBusesComponent implements OnInit {
  buses: any[] = [];
  newBus: BusDTO = { busName: '', vendorName: '', totalSeats: 0, price: 0 };
  editing: BusDTO & { busId: number } = {
    busId:      0,
    busName:    '',
    vendorName: '',
    totalSeats: 0,
    price:      0
  };

  editModal: any;
  showDeleteModal = false;
  showSpinner = true;
  deleteId?: number;
  

  constructor(private ms: MasterService, private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    this.load();
    this.editModal = new bootstrap.Modal(
      document.getElementById('editBusModal')
    );
  }

  load() {
    this.ms.getBuses().subscribe(res => {
      this.showSpinner = false;
      this.buses = res;
      console.log("bus response:", this.buses);
    });
  }

  

  addBus() {
    this.ms.addBus(this.newBus).subscribe(() => {
      this.toastrSvc.success("New Bus registered successfully", "Success");
      this.load();
      this.newBus = { busName: '', vendorName: '', totalSeats: 0, price: 0 };
    });
  }

  openEditModal(bus: any) {
    this.editing = { ...bus };
    this.editModal.show();
  }

  updateBus() {
    this.ms.updateBus(this.editing.busId, this.editing).subscribe(() => {
      this.toastrSvc.success("Bus updated successfully","Updated");
      this.load();
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
    this.ms.deleteBus(this.deleteId!).subscribe({
      next: () => {
        this.toastrSvc.error('Bus data deleted successfully', 'Deleted');
        this.load();  
        this.deleteId = undefined;
      },
      error: err => this.toastrSvc.error('Delete failed: ', `${err}`)
    });
  }

}
