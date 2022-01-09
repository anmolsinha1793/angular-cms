import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LoginResolver } from '@core/resolver/login.resolver';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  // {path: '/', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, resolve: {loginData: LoginResolver}},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-section', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  canActivate: [AuthGuard],
  data: {role: 'ADMIN'}
  },
  {path: 'employee-section', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
  canActivate: [AuthGuard],
  data: {role: 'EMP'}
},
  {path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
