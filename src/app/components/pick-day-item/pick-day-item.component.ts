import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AvailableItemsModel } from '@shared/models/AvailableItems.model';
import { ItemsOfTheDayModel } from '@shared/models/ItemsOfTheDay.model';
import { CMSModelState } from '@shared/state/cms.state';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-pick-day-item',
  templateUrl: './pick-day-item.component.html',
  styleUrls: ['./pick-day-item.component.scss'],
})
export class PickDayItemComponent implements OnInit {
  pickItemForm: FormGroup;
  options: AvailableItemsModel[] = [];
  filteredOptions: Observable<AvailableItemsModel[]>;
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<PickDayItemComponent>
  ) {
    this.fetchAvailableItems();
    this.pickItemForm = new FormGroup({
      items: new FormControl('', Validators.required),
      totalQuantity: new FormControl(0, [Validators.required]),
      maxQuantity: new FormControl(0, [Validators.required]),
    });
  }
  /**
   * Lifecycle hook for angular
   * @returns void.
   */
  ngOnInit(): void {
    this.filteredOptions = this.pickItemForm.get('items').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }
  /**
   * Function to submit data entered
   * @returns void.
   */
  submit(): void {
    const pickFormValue = this.pickItemForm.getRawValue();
    this.dialogRef.close(pickFormValue);
  }
  /**
   * Function to set validator validations and quantity
   * @param event value from template
   * @returns void.
   */
  setQuantityValidator(event: any): void {
    this.pickItemForm.get('totalQuantity').clearValidators();
    this.pickItemForm
      .get('maxQuantity')
      .patchValue(event.option.value.itemQuantity);
    this.pickItemForm
      .get('totalQuantity')
      .setValidators([
        Validators.required,
        Validators.max(event.option.value.itemQuantity),
      ]);
  }
  /**
   * Function to fetch available items from JSON file
   * @returns void.
   */
  fetchAvailableItems(): void {
    const itemsOfTheDay = this.store.selectSnapshot(
      CMSModelState.getItemsOfTheDay
    );
    this.options = this.store
      .selectSnapshot(CMSModelState.getAvailableItems)
      .filter((elm: AvailableItemsModel) =>
        itemsOfTheDay.every(
          (el: ItemsOfTheDayModel) => el.itemCode !== elm.itemCode
        )
      );
  }
  /**
   * Function to display items
   * @param availableItem item which needs to be displayed
   * @returns {string}.
   */
  displayFn(availableItem: AvailableItemsModel): string {
    return availableItem && availableItem.itemName
      ? availableItem.itemName
      : '';
  }
  /**
   * Function to filter items
   * @param name item which needs to be filtered
   * @returns {AvailableItemsModel[]}.
   */
  private _filter(name: string): AvailableItemsModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.itemName.toLowerCase().includes(filterValue)
    );
  }
}
