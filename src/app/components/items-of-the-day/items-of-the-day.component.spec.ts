import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsOfTheDayComponent } from './items-of-the-day.component';

describe('ItemsOfTheDayComponent', () => {
  let component: ItemsOfTheDayComponent;
  let fixture: ComponentFixture<ItemsOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsOfTheDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
