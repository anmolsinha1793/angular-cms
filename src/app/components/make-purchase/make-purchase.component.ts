import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@core/api/api.service';
import { Store } from '@ngxs/store';
import { SetItemsOfTheDay } from '@shared/actions/Items.action';
import {
  AddTransaction,
  SetTransaction,
} from '@shared/actions/Transactions.action';
import { SetUser, UpdateUser } from '@shared/actions/User.action';
import { ItemsOfTheDayModel } from '@shared/models/ItemsOfTheDay.model';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddMoneyComponent } from '../add-money/add-money.component';

export interface DialogData {
  empId?: string;
  balance?: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-make-purchase',
  templateUrl: './make-purchase.component.html',
  styleUrls: ['./make-purchase.component.scss'],
})
export class MakePurchaseComponent implements OnInit {
  unSubscription$ = new Subject();
  itemsToDisplay: any = [];
  purchaseForm: FormGroup;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public store: Store,
    public dialogRef: MatDialogRef<AddMoneyComponent>
  ) {
    this.purchaseForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.fetchItemsOfTheDay();
  }
  /**
   * Function to get form control name
   * @param name name of the form control
   * @returns {AbstractControl}.
   */
  getName(name: string): AbstractControl {
    return this.purchaseForm.controls[name];
  }
  /**
   * Function to fetch items of the day
   * @returns void.
   */
  fetchItemsOfTheDay(): void {
    this.apiService
      .fetchItemsOfTheDay()
      .pipe(takeUntil(this.unSubscription$))
      .subscribe((res) => {
        this.itemsToDisplay = res.map((elm) => {
          return {
            ...elm,
            desiredQuantity: 0,
          };
        });
        this.createFormControls();
      });
  }
  /**
   * Function to make purchase of items
   * @returns void.
   */
  makePurchase(): void {
    let userData = this.store.selectSnapshot(CMSModelState.getUserData);
    // userData.find((el) => el.empId === this.data.empId).balance = this.data.balance - this.getGrandTotal();
    const foundUser = userData.find((el) => el.empId === this.data.empId);
    foundUser.balance = this.data.balance - this.getGrandTotal();
    // this.store.dispatch(new UpdateUser(foundUser));
    let itemsOftheday = this.store.selectSnapshot(
      CMSModelState.getItemsOfTheDay
    ) as ItemsOfTheDayModel[];
    itemsOftheday = itemsOftheday.map((elm) => {
      return {
        ...elm,
        itemQuantity:
          elm.itemQuantity - this.purchaseForm.controls[elm.itemName].value,
      };
    });
    const { name, email, empId } = this.data;
    const transactionObj: TransactionDetailsModel = {
      name,
      email,
      empId,
      transactionAmount: this.getGrandTotal(),
      source: sessionStorage.getItem('role') === 'ADMIN' ? 'admin' : 'self',
      dateDetail: new Date().getTime(),
      type: 'debit',
    };
    this.dialogRef.close([itemsOftheday, foundUser, transactionObj]);
  }
  /**
   * Function to create form controls based on response
   * @returns void.
   */
  createFormControls(): void {
    this.itemsToDisplay.forEach(
      (element: ItemsOfTheDayModel, index: number) => {
        this.purchaseForm.addControl(
          `${element.itemName}`,
          this.fb.control(0, [Validators.max(element.itemQuantity)])
        );
      }
    );
  }
  /**
   * Function to calculate grand total of all selected items
   * @returns {number}.
   */
  getGrandTotal(): number {
    return Object.keys(this.purchaseForm.controls).reduce(
      (acc, elm) =>
        (acc +=
          this.purchaseForm.controls[elm].value *
          this.itemsToDisplay.find(({ itemName }: any) => itemName === elm)
            .basePrice),
      0
    );
  }
  /**
   * Lifecycle hook of angular executes when component gets unmounted from dom
   * @returns void.
   */
  ngOnDestroy(): void {
    this.unSubscription$.next();
    this.unSubscription$.complete();
  }
}
