import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@core/api/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input() error: string | null = '';
  loginForm: FormGroup;
  @Output() submitEM = new EventEmitter();
  isError = false;

  constructor(
    private readonly router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = new FormGroup({
      empId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  /**
   * Lifecycle hook for angular
   * @returns void.
   */
  ngOnInit(): void {
    this.loginForm.valueChanges
      .subscribe((res) => {
        this.isError = false;
      })
  }

  /**
   * Function to submit entered details
   * @returns void.
   */
  submit(): void {
    if (this.loginForm.valid) {
      const loginFormValue = this.loginForm.getRawValue();
      this.loginService
        .getUser(loginFormValue.empId, loginFormValue.password)
        .subscribe((emp) => {
          console.log('fsdf', emp);
          if (!emp) {
            this.isError = true;
            this.error = 'No user exists with given credentials.'
            return;
          }
          this.isError = false;
          if (emp?.role === 'ADMIN') {
            this.router.navigate(['./admin-section']).then(() => {
              sessionStorage.setItem('empId', loginFormValue.empId);
              sessionStorage.setItem('role', emp?.role);
            });
          } else if (emp?.role === 'EMP') {
            this.router.navigate(['./employee-section']).then(() => {
              sessionStorage.setItem('empId', loginFormValue.empId);
              sessionStorage.setItem('role', emp?.role);
            });
          }
        });
      // this.submitEM.emit(this.loginForm.value);
    }
  }
}
