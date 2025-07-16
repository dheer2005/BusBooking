import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './Pages/search/search.component';
import { BookingComponent } from './Pages/booking/booking.component';
import { UserBookingsComponent } from './Pages/user-bookings/user-bookings.component';
import { AdminDashboardComponent } from './Pages/Admin/admin-dashboard/admin-dashboard.component';
import { ManageBusesComponent } from './Pages/Admin/manage-buses/manage-buses.component';
import { ManageSchedulesComponent } from './Pages/Admin/manage-schedules/manage-schedules.component';
import { ManageBookingsComponent } from './Pages/Admin/manage-bookings/manage-bookings.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { AuthGuard } from './Pages/Guards/auth.guard';
import { RateBusComponent } from './Pages/rate-bus/rate-bus.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'booking/:id', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'my-bookings', component: UserBookingsComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
      { path: 'buses', component: ManageBusesComponent, canActivate: [AuthGuard] },
      { path: 'schedules', component: ManageSchedulesComponent, canActivate: [AuthGuard] },
      { path: 'bookings', component: ManageBookingsComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  { path: 'rate-bus', component: RateBusComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
