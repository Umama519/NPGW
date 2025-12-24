import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortInoutSummaryReportComponent } from './port-inout-summary-report.component';

describe('PortInoutSummaryReportComponent', () => {
  let component: PortInoutSummaryReportComponent;
  let fixture: ComponentFixture<PortInoutSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortInoutSummaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortInoutSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
