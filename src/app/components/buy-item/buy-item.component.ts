import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ItemsOfTheDayModel } from '@shared/models/ItemsOfTheDay.model';
import { CMSModelState } from '@shared/state/cms.state';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.scss'],
})
export class BuyItemComponent implements OnInit {
  purchaseItemForm: FormGroup;
  options: ItemsOfTheDayModel[] = [];
  filteredOptions: Observable<ItemsOfTheDayModel[]>[] = [];
  grandTotal: number = 0;
  get itemFormGroups() {
    return this.purchaseItemForm.get('chooseItem') as FormArray;
  }
  constructor(private store: Store, @Inject(MAT_DIALOG_DATA) public data: {balance: number}, public dialogRef: MatDialogRef<BuyItemComponent>) {
    this.fetchAvailableItems();
    this.purchaseItemForm = new FormGroup({
      chooseItem: new FormArray([
        new FormGroup({
          selectedItem: new FormControl('', Validators.required),
          quantity: new FormControl(0, [Validators.required]),
          itemTotalPrice: new FormControl(0, [Validators.required]),
        }),
      ]),
    });
  }

  ngOnInit(): void {
    const initialItem = this.itemFormGroups.at(0).get('selectedItem');
    this.createFilterOptions(initialItem);
    this.updateGrandTotal(this.itemFormGroups.at(0));
  }
  updateGrandTotal(group: AbstractControl): void {
    group.get('quantity').valueChanges.subscribe((quantity) => {
      const groupTotal = group.get('selectedItem').value.basePrice * quantity;
      group.patchValue({
        itemTotalPrice: groupTotal
      });
      const purchaseItemFormValue = this.purchaseItemForm.value;
      this.grandTotal = 0;
      purchaseItemFormValue.chooseItem.forEach(({itemTotalPrice}: any) => {
        this.grandTotal += itemTotalPrice;
      });
    })
  }
  /**
   * Function to fetch available items from JSON file
   * @returns void.
   */
  fetchAvailableItems(): void {
    this.options = this.store.selectSnapshot(CMSModelState.getItemsOfTheDay);
  }
  createFilterOptions(control: AbstractControl): void {
    const filterOptions = control.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
    this.filteredOptions.push(filterOptions);
  }
  /**
   * Function to filter items
   * @param name item which needs to be filtered
   * @returns {ItemsOfTheDayModel[]}.
   */
  private _filter(name: string): ItemsOfTheDayModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.itemName.toLowerCase().includes(filterValue)
    );
  }
  addAnotherItem(): void {
    const anotherItem = new FormGroup({
      selectedItem: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required]),
      itemTotalPrice: new FormControl(0, [Validators.required]),
    });
    this.createFilterOptions(anotherItem.get('selectedItem'));
    this.updateGrandTotal(anotherItem);
    this.itemFormGroups.push(anotherItem);
  }
  submit(): void {
    const purchaseFormValue = this.purchaseItemForm.getRawValue();
    this.dialogRef.close([purchaseFormValue.chooseItem, this.grandTotal]);
  }
  /**
   * Function to display items
   * @param availableItem item which needs to be displayed
   * @returns {string}.
   */
  displayFn(availableItem: ItemsOfTheDayModel): string {
    return availableItem && availableItem.itemName
      ? `${availableItem.itemName} - [Price: ${availableItem.basePrice}/-]`
      : '';
  }
}
