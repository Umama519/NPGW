import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortOutSummaryReportComponent } from './port-out-summary-report.component';

describe('PortOutSummaryReportComponent', () => {
  let component: PortOutSummaryReportComponent;
  let fixture: ComponentFixture<PortOutSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortOutSummaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortOutSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
