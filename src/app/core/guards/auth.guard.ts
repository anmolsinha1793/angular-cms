import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = sessionStorage.getItem('role');
    const routeRoles = route.data.roles;
    if (userRole && userRole !== routeRoles)  {
        //redirect to login/home page etc
        //return false to cancel the navigation
        this.router.navigate(['./login'])
        // this.router.navigate([this.router.url]);
        return false;
    }
    return true;
  }

}
