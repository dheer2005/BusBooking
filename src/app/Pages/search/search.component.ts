import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { MasterService } from 'src/app/Service/master.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private toastrSvc: ToastrService){}
  locations$: Observable<any[]> = new Observable<any[]>();
  masterSrv = inject(MasterService);
  busList: any[] = [];
  emptyBusList: boolean = false;
  showSpinner = false;
  minDate: string = new Date().toISOString().split('T')[0];

  map: L.Map | undefined;
  fromCoords: [number, number] | null = null;
  toCoords: [number, number] | null = null;
  showMap = false;
  locationList?: any[];
  routingControl: any = null;

  serachObj = {
    fromLocationId: '',
    toLocationId: '',
    travelDate: ''
  };

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locations$ = this.masterSrv.getLocations().pipe(
      map((locations: any[]) => {
        const sorted = locations.sort((a: any, b: any) =>
        a.locationName.localeCompare(b.locationName)
      );
      this.locationList = sorted;
      return sorted;
      })
    );
  }

  onSearch() {
    this.showSpinner = true;
    this.showMap = true;
    const { fromLocationId, toLocationId, travelDate } = this.serachObj;

    if (!fromLocationId || !toLocationId || !travelDate) {
      this.toastrSvc.warning('Please select all fields', 'Invalid');
      this.showSpinner = false;
      return;
    }

    const fromLocationName = this.locationList?.find(loc => loc.locationId === Number(fromLocationId))?.locationName;
    const toLocationName = this.locationList?.find(loc => loc.locationId === Number(toLocationId))?.locationName;

     forkJoin({
        from: this.masterSrv.getCoordinates(fromLocationName),
        to: this.masterSrv.getCoordinates(toLocationName)
      }).subscribe({
        next: (res: any) => {
          this.fromCoords = res.from;
          this.toCoords = res.to;

          this.loadMap();
        },
        error: (err) => {
          this.toastrSvc.error('Failed to get coordinates', 'Failed');
          this.showSpinner = false;
        }
      });

    this.masterSrv.serachBus(fromLocationId, toLocationId, travelDate).subscribe({
      next: (res) => {
        this.busList = res;
        this.emptyBusList = this.busList.length === 0;
        this.showSpinner = false;
      },
      error: (err) => {
        this.toastrSvc.error('Search failed', 'Failed');
        this.showSpinner = false;
      }
    });
  }

  loadMap(): void {
    if (!this.fromCoords || !this.toCoords) return;

    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        this.toastrSvc.error('Map container not found.','Not Found');
        return;
      }

      // Destroy previous map if already exists
      if (this.map) {
        this.map.remove();
        this.map = undefined;
      }

      this.map = L.map('map').setView(this.fromCoords!, 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }
      
      this.routingControl = (L.Routing.control({
        waypoints: [
          L.latLng(this.fromCoords![0], this.fromCoords![1]),
          L.latLng(this.toCoords![0], this.toCoords![1])
        ],
        routeWhileDragging: false,
        createMarker: function (i: number, waypoint: any, n: number) {
          const iconUrl = i === 0 ? 'assets/marker-icon-2x.png' : 'assets/red-marker-icon.png';

          return L.marker(waypoint.latLng, {
            icon: L.icon({
              iconUrl: iconUrl,
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          });
        }
      } as any)).addTo(this.map);
    }, 0);
  }

  isBookingAllowed(departureTimeStr: string): boolean {
    const now = new Date();
    const departureTime = new Date(departureTimeStr);
    return departureTime > now;
  }
}
