import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NPRManualLogReportComponent } from './nprmanual-log-report.component';

describe('NPRManualLogReportComponent', () => {
  let component: NPRManualLogReportComponent;
  let fixture: ComponentFixture<NPRManualLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NPRManualLogReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NPRManualLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
