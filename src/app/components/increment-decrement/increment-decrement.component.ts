import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-increment-decrement',
  templateUrl: './increment-decrement.component.html',
  styleUrls: ['./increment-decrement.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: IncrementDecrementComponent,
    },
  ],
})
export class IncrementDecrementComponent implements ControlValueAccessor {
  quantity = 0;

  @Input() increment: number;
  @Input() maxLimit: number;

  onChange = (quantity: any) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  /**
   * Function to increment quantity
   * @returns void.
   */
  onAdd(): void {
    if (this.quantity < this.maxLimit) {
      this.markAsTouched();
      if (!this.disabled) {
        this.quantity += this.increment;
        this.onChange(this.quantity);
      }
    }
  }
  /**
   * Function to decrement quantity
   * @returns void.
   */
  onRemove(): void {
    if (this.quantity > 0) {
      this.markAsTouched();
      if (!this.disabled) {
        this.quantity -= this.increment;
        this.onChange(this.quantity);
      }
    }
  }
  /**
   * Function to write quantity value
   * @param quantity value which needs to be written
   * @returns void.
   */
  writeValue(quantity: number): void {
    this.quantity = quantity;
  }
  /**
   * Function to register on change
   * @param onChange item which needs to be changed
   * @returns void.
   */
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  /**
   * Function to register item on touch
   * @param res item which needs to be touched
   * @returns void.
   */
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  /**
   * Function to mark form as touched
   * @returns void.
   */
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  /**
   * Function to disable button item
   * @param disabled button which needs to be deleted
   * @returns void.
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
