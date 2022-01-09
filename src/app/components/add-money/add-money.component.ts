import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SetUser } from '@shared/actions/User.action';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';

export interface DialogData {
  empId?: string;
  balance?: number;
  name: string;
  email: string;
}
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss'],
})
export class AddMoneyComponent implements OnInit {
  @Input() error: string | null = '';
  addMoneyForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public store: Store,
    public dialogRef: MatDialogRef<AddMoneyComponent>
  ) {
    this.addMoneyForm = new FormGroup({
      empId: new FormControl('', Validators.required),
      balance: new FormControl(0, Validators.required),
      newAmount: new FormControl('', Validators.required),
    });
  }
  /**
   * Lifecycle hook of angular
   * @returns void.
   */
  ngOnInit(): void {
    const empId = 'empId';
    const balance = 'balance';
    this.addMoneyForm.controls[empId].disable();
    this.addMoneyForm.controls[empId].patchValue(this.data.empId);
    this.addMoneyForm.controls[balance].patchValue(+this.data.balance);
  }
  /**
   * Function to submit entered data
   * @returns void.
   */
  submit(): void {
    if (this.addMoneyForm.valid) {
      let userData = this.store.selectSnapshot(CMSModelState.getUserData);
      // userData.find((el) => el.empId === this.data.empId).balance = this.data.balance + +this.addMoneyForm.controls['newAmount'].value;
      const foundUser = userData.find((el) => el.empId === this.data.empId);
      foundUser.balance =
        this.data.balance + +this.addMoneyForm.controls['newAmount'].value;
      const { name, email, empId } = this.data;
      const transactionObj: TransactionDetailsModel = {
        name,
        email,
        empId,
        transactionAmount: this.addMoneyForm.controls['newAmount'].value,
        source: sessionStorage.getItem('role') === 'ADMIN' ? 'admin' : 'self',
        dateDetail: new Date().getTime(),
        type: 'credit',
      };
      // let obj = {} as any;
      // obj['empId'] = this.data.empId;
      // obj['newAmount'] = this.data.balance + +this.addMoneyForm.controls['newAmount'].value;
      // this.store.dispatch(new AddAmount(obj));
      // this.store.dispatch(new SetUser(userData));
      this.dialogRef.close([foundUser, transactionObj]);
    }
  }
}
