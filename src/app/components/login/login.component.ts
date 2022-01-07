import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() error: string | null = '';
  loginForm: FormGroup;
  @Output() submitEM = new EventEmitter();

  constructor() {
    this.loginForm = new FormGroup({
      empId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
  }


  submit() {
    if (this.loginForm.valid) {
      this.submitEM.emit(this.loginForm.value);
    }
  }
}
