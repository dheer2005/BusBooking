import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './Pages/search/search.component';
import { BookingComponent } from './Pages/booking/booking.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { UserBookingsComponent } from './Pages/user-bookings/user-bookings.component';
import { ManageBusesComponent } from './Pages/Admin/manage-buses/manage-buses.component';
import { ManageSchedulesComponent } from './Pages/Admin/manage-schedules/manage-schedules.component';
import { ManageBookingsComponent } from './Pages/Admin/manage-bookings/manage-bookings.component';
import { AdminDashboardComponent } from './Pages/Admin/admin-dashboard/admin-dashboard.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { NgChartsModule } from 'ng2-charts';
import { RateBusComponent } from './Pages/rate-bus/rate-bus.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BookingComponent,
    UserBookingsComponent,
    ManageBusesComponent,
    ManageSchedulesComponent,
    ManageBookingsComponent,
    AdminDashboardComponent,
    CheckoutComponent,
    PageNotFoundComponent,
    RateBusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    DatePipe,
    NgChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
