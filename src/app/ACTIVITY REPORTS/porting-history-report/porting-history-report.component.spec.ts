import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortingHistoryReportComponent } from './porting-history-report.component';

describe('PortingHistoryReportComponent', () => {
  let component: PortingHistoryReportComponent;
  let fixture: ComponentFixture<PortingHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortingHistoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortingHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
