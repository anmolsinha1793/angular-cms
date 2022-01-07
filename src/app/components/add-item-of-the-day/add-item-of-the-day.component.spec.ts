import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemOfTheDayComponent } from './add-item-of-the-day.component';

describe('AddItemOfTheDayComponent', () => {
  let component: AddItemOfTheDayComponent;
  let fixture: ComponentFixture<AddItemOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemOfTheDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
