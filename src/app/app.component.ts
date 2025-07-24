import { Component, Inject, inject } from '@angular/core';
import { MasterService } from './Service/master.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedUserData: any = null;
  isLoginForm = true;

  registerObj = { userName: '', fullName: '', emailId: '', role: 'User', password: '' };
  loginObj   = { emailId: '', password: '' };

  constructor(private masterSrv: MasterService, private router: Router, private toastrSvc: ToastrService) {
    const user = localStorage.getItem('redBusUser');
    if (user) this.loggedUserData = JSON.parse(user);
  }

  get isAdmin()    { return this.loggedUserData?.role === 'Admin'; }
  get isLoggedIn() { return !!this.loggedUserData; }

  onRegister() {
    this.masterSrv.onRegisterUser(this.registerObj).subscribe({
      next: (res) => {
        this.loggedUserData = { ...res, role: 'User' };
        localStorage.setItem('redBusUser', JSON.stringify(this.loggedUserData));
      },
      error: () => this.toastrSvc.error('Registration failed','Failed')
    });
  }

  onLogin() {
    this.masterSrv.loginUser(this.loginObj).subscribe({
      next: (res) => {
        this.loggedUserData = res; 
        localStorage.setItem('redBusUser', JSON.stringify(res));
        if (this.isAdmin) this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/search']);
      },
      error: () => {
        this.loginObj.emailId = '';
        this.loginObj.password = '';
        this.toastrSvc.error('Invalid credentials','Invalid');
      }
    });
  }

  logoff() {
    localStorage.removeItem('redBusUser');
    this.loggedUserData = null;
    this.toastrSvc.error("User logged out", "Log off");
    this.router.navigate(['/search']);
  }
}
