import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortingStatusReportComponent } from './porting-status-report.component';

describe('PortingStatusReportComponent', () => {
  let component: PortingStatusReportComponent;
  let fixture: ComponentFixture<PortingStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortingStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortingStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
