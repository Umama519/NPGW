import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaySetupComponent } from './holiday-setup.component';

describe('HolidaySetupComponent', () => {
  let component: HolidaySetupComponent;
  let fixture: ComponentFixture<HolidaySetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaySetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidaySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
