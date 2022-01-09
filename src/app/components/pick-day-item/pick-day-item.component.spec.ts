import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickDayItemComponent } from './pick-day-item.component';

describe('PickDayItemComponent', () => {
  let component: PickDayItemComponent;
  let fixture: ComponentFixture<PickDayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickDayItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickDayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
