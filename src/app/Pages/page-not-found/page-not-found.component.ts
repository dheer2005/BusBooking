import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  loggedUserData: any = null;
  router = inject(Router);
  
  constructor() 
  {
    const user = localStorage.getItem('redBusUser');
    if (user) this.loggedUserData = JSON.parse(user);
  }

  get isAdmin()    { return this.loggedUserData?.role === 'Admin'; }


  ngOnInit(): void {
  }

  goHome(){
    if (this.isAdmin) this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/search']);
  }

}
