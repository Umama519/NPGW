import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortInSummaryReportComponent } from './port-in-summary-report.component';

describe('PortInSummaryReportComponent', () => {
  let component: PortInSummaryReportComponent;
  let fixture: ComponentFixture<PortInSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortInSummaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortInSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
