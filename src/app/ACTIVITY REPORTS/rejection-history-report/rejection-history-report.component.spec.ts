import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionHistoryReportComponent } from './rejection-history-report.component';

describe('RejectionHistoryReportComponent', () => {
  let component: RejectionHistoryReportComponent;
  let fixture: ComponentFixture<RejectionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionHistoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
