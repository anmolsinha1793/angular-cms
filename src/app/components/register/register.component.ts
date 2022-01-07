import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() error: string | null = '';
  registerForm: FormGroup
  Roles: any = ['Admin', 'Employee'];
  @Output() submitEM = new EventEmitter();

  constructor() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      role: new FormControl('', Validators.required),
      empId: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
   }

  ngOnInit(): void {
  }

  submit() {
    if (this.registerForm.valid) {
      this.submitEM.emit(this.registerForm.value);
    }
  }

}
