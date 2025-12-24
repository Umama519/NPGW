import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHoursReportComponent } from './business-hours-report.component';

describe('BusinessHoursReportComponent', () => {
  let component: BusinessHoursReportComponent;
  let fixture: ComponentFixture<BusinessHoursReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessHoursReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessHoursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
