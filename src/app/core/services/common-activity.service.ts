import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { routes } from 'app/app-routing.module';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonActivityService {
  isValueChanged = new Subject<any>();
  routes = routes;
  constructor(private router: Router) { }
  setChange = (flag: boolean) =>  this.isValueChanged.next(flag);
  getChange = (): Observable<any> =>  this.isValueChanged.asObservable();
  getAdminRoutes(): any {
    const routerConfig = this.router.config;
    routerConfig.unshift({path: 'admin-section', loadChildren: () => import('../../modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: {role: 'ADMIN'}
    });
    return routerConfig;
  }
  getEmployeeRoutes(): any {
    const routerConfig = this.router.config;
    routerConfig.unshift({path: 'employee-section', loadChildren: () => import('../../modules/employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [AuthGuard],
    data: {role: 'EMP'}
    });
    return routerConfig;
  }
}
