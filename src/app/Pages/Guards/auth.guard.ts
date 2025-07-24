import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private route: ActivatedRoute){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const user = localStorage.getItem('redBusUser');
    // if (user){
    //   const loggedUserData = JSON.parse(user);
    //   if(loggedUserData?.role === 'Admin' && ((this.route.routeConfig?.path == 'admin/buses')
    //     ||(this.route.routeConfig?.path == 'admin/schedules')
    //     ||(this.route.routeConfig?.path == 'admin/bookings'))){
    //     this.router.navigateByUrl('admin/dashboard');
    //     return false;
    //   }else if(loggedUserData?.role === 'User' && ((this.route.routeConfig?.path == 'my-bookings')||
    //             (this.route.routeConfig?.path == 'checkout')||
    //             (this.route.routeConfig?.path == 'rate-bus'))){
    //               this.router.navigateByUrl('search');
    //               return false;
    //             }
    //   return true;
    // } 
    // return true;
    const user = localStorage.getItem('redBusUser');

    if (!user) {
      // Not logged in, allow to go to public routes (you can change this logic if needed)
      return true;
    }

    const loggedUserData = JSON.parse(user);
    const role = loggedUserData?.role;

    const targetUrl = state.url;
    if (role === 'Admin') {
      if (targetUrl.startsWith('/my-bookings') || targetUrl.startsWith('/checkout') || targetUrl.startsWith('/rate-bus') || targetUrl.startsWith('/search')) {
        return this.router.parseUrl('/admin/dashboard');
      }
      return true;
    }
    if (role === 'User') {
      if (targetUrl.startsWith('/admin')) {
        return this.router.parseUrl('/search');
      }
      return true;
    }

    return false;
  }
  
}
