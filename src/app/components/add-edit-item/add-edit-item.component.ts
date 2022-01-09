import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { CMSModelState } from '@shared/state/cms.state';

export interface AddEditDialogData {
  action: string;
  itemCode?: string;
  itemName?: string;
  basePrice?: number;
  itemQuantity?: number;
  id?: string;
  maxQuantity?: number;
}

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.scss'],
})
export class AddEditItemComponent implements OnInit {
  itemForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddEditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditDialogData,
    private store: Store
  ) {
    this.itemForm = new FormGroup({
      itemName: new FormControl('', Validators.required),
      itemCode: new FormControl('', [Validators.required]),
      basePrice: new FormControl(0, Validators.required),
      itemQuantity: new FormControl(0, Validators.required),
    });
  }
  /**
   * Lifecycle hook for angular
   * @returns void.
   */
  ngOnInit(): void {
    if (this.data.maxQuantity) {
      this.itemForm
        .get('itemQuantity')
        .setValidators([Validators.max(this.data.maxQuantity)]);
    }
    if (this.data.action === 'Add') {
      this.itemForm.get('itemCode').patchValue(this.data.id);
      this.itemForm.get('itemCode').disable();
    }
    if (this.data.action === 'Edit') {
      this.itemForm.patchValue(this.data);
      this.itemForm.get('itemCode').disable();
    }
  }
  /**
   * Function to submit entered details
   * @returns void.
   */
  submit(): void {
    if (this.itemForm.valid) {
      const itemFormValue = this.itemForm.getRawValue();
      const availableItems = this.store
        .selectSnapshot(CMSModelState.getAvailableItems)
        .find((elm) => elm.itemCode === itemFormValue.itemCode);
      const items = this.store
        .selectSnapshot(CMSModelState.getItemsOfTheDay)
        .find((elm) => elm.itemCode === itemFormValue.itemCode);
        if (this.data.maxQuantity) {
          availableItems.itemQuantity =
          availableItems?.itemQuantity -
          (itemFormValue?.itemQuantity - items?.itemQuantity);
        items.basePrice = itemFormValue.basePrice;
        availableItems.basePrice = itemFormValue?.basePrice;
        }
      this.data.maxQuantity
        ? this.dialogRef.close([itemFormValue, availableItems])
        : this.dialogRef.close(itemFormValue);
    }
  }
}
