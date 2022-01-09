import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AddUser } from '@shared/actions/User.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Input() error: string | null = '';
  registerForm: FormGroup;
  Roles: any = ['ADMIN', 'EMP'];
  @Output() submitEM = new EventEmitter();

  constructor(private store: Store, private readonly router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      role: new FormControl('', Validators.required),
      empId: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }
  /**
   * Lifecycle hook for angular
   * @returns void.
   */
  ngOnInit(): void {}
  /**
   * Function to submit user entered values
   * @returns void.
   */
  submit(): void {
    if (this.registerForm.valid) {
      const registerFormValue = this.registerForm.getRawValue();
      this.store.dispatch(new AddUser(registerFormValue)).subscribe((res) => {
        if (registerFormValue?.role === 'ADMIN') {
          this.router.navigate(['./admin-section']).then(() => {
            sessionStorage.setItem('empId', registerFormValue.empId);
            sessionStorage.setItem('role', registerFormValue?.role);
          });
        } else if (registerFormValue?.role === 'EMP') {
          this.router.navigate(['./employee-section']).then(() => {
            sessionStorage.setItem('empId', registerFormValue.empId);
            sessionStorage.setItem('role', registerFormValue?.role);
          });
        }
      });
      // this.submitEM.emit(this.registerForm.value);
    }
  }
}
