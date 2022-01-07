import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AddAmount } from 'src/app/shared/actions/Amount.action';
import { SetUser } from 'src/app/shared/actions/User.action';
import { CMSModelState } from 'src/app/shared/state/cms.state';

export interface DialogData {
  empId?: string;
  balance?: number;
}
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent implements OnInit {
  @Input() error: string | null = '';
  addMoneyForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public store: Store, public dialogRef: MatDialogRef<AddMoneyComponent>,) {
    this.addMoneyForm = new FormGroup({
      empId: new FormControl('', Validators.required),
      balance: new FormControl(0, Validators.required),
      newAmount: new FormControl('', Validators.required),
    });
   }

  ngOnInit(): void {
    const empId = 'empId';
    const balance = 'balance';
    this.addMoneyForm.controls[empId].patchValue(this.data.empId);
    this.addMoneyForm.controls[balance].patchValue(+this.data.balance);
  }
  submit() {
    if (this.addMoneyForm.valid) {
      let userData = this.store.selectSnapshot(
        CMSModelState.getUserData
      );
      userData.find((el) => el.empId === this.data.empId).balance = this.data.balance + +this.addMoneyForm.controls['newAmount'].value;
      // let obj = {} as any;
      // obj['empId'] = this.data.empId;
      // obj['newAmount'] = this.data.balance + +this.addMoneyForm.controls['newAmount'].value;
      // this.store.dispatch(new AddAmount(obj));
      this.store.dispatch(new SetUser(userData));
      this.dialogRef.close();
      console.log(userData);
    }
  }
}
