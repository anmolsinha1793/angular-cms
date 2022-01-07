import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './modules/admin/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './modules/employee/employee-layout/employee-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full',},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-section', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)},
  {path: 'employee-section', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
