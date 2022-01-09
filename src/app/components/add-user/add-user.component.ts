import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { CMSModelState } from '@shared/state/cms.state';
import { DialogData } from '../add-money/add-money.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  @Input() error: string | null = '';
  addUserForm: FormGroup;
  Roles: any = ['ADMIN', 'EMP'];
  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store
  ) {
    this.addUserForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      role: new FormControl('EMP', Validators.required),
      empId: new FormControl('', Validators.required),
      balance: new FormControl(500, Validators.required),
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
  ngOnInit(): void {
    const userId = `test${
      this.store.selectSnapshot(CMSModelState.getUserData).length + 1
    }`;
    this.addUserForm.get('empId').patchValue(userId);
  }
  /**
   * Function to submit entered data
   * @returns void.
   */
  submit(): void {
    if (this.addUserForm.valid) {
      const registerFormValue = this.addUserForm.getRawValue();
      // this.store.dispatch(new AddUser(registerFormValue));
      this.dialogRef.close(registerFormValue);
    }
  }
}
