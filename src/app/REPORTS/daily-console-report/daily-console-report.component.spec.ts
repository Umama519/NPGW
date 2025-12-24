import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyConsoleReportComponent } from './daily-console-report.component';

describe('DailyConsoleReportComponent', () => {
  let component: DailyConsoleReportComponent;
  let fixture: ComponentFixture<DailyConsoleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyConsoleReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyConsoleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
