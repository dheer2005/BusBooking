import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MasterService } from 'src/app/Service/master.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  stats: any = {};
  lovedBuses:any[] = [];
  totalRevenue?: number
  showSpinner = true;
  revenueChartLabels: string[] = [];
  revenueChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8'] 
      }
    ]
  };
  public revenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'left' as const,
          labels: {
            boxWidth: 20,
            padding: 10,
          }
        }
      }
    };

  topBusChartLabels: string[] = [];
  topBusChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Bookings',
        data: [],
        backgroundColor: '#42a5f5'
      }
    ]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  LeastRevenueBusChartLabels: string[] = [];
  LeastRevenueBusChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Bookings',
        data: [],
        backgroundColor: '#42a5f5'
      }
    ]
  };
  leastPerformingBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 500
        }
      }
    }
  };

  constructor(private masterSrv: MasterService) {}

  ngOnInit(): void {
    this.masterSrv.getStats().subscribe({
      next: (res:any)=>{
        this.stats = res;
        this.showSpinner = false;
      }
    });
    this.loadTopFiveRevenueBus();
    this.loadTopPerformingBuses();
    this.loadLeastFiveRevenucBuses();
    this.loadTopLovedBuses();
  }


  loadTopFiveRevenueBus() {
    this.masterSrv.getTopFiveRevenueBuses().subscribe((res: any[]) => {
      this.revenueChartData = {
        labels: res.map(b => b.busName),
        datasets: [
          {
            data: res.map(b => b.revenue),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8']
          }
        ]
      };
    });
  }

  loadTopPerformingBuses() {
    this.masterSrv.getTopBuses().subscribe((res: any[]) => {
      this.topBusChartData = {
        labels: res.map(b => b.busName),
        datasets: [
          {
            label: 'Bookings',
            data: res.map(b => b.totalBookings),
            backgroundColor: '#42a5f5'
          }
        ]
      };
    });
  }

  loadLeastFiveRevenucBuses() {
    this.masterSrv.getLeastFiveRevenueBuses().subscribe((res: any[]) => {
      this.LeastRevenueBusChartData = {
        labels: res.map(b => b.busName),
        datasets: [
          {
            label: 'Revenue',
            data: res.map(b => b.revenue),
            backgroundColor: '#75A7C6'
          }
        ]
      };
    });
  }

  loadTopLovedBuses(){
    this.masterSrv.getTopLovedBuses().subscribe((res:any[])=>{
      this.lovedBuses = res.sort((a,b)=> b.averageRating - a.averageRating);
    })
  }

}
