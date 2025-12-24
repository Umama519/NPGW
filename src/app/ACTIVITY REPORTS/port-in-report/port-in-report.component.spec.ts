import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortInReportComponent } from './port-in-report.component';

describe('PortInReportComponent', () => {
  let component: PortInReportComponent;
  let fixture: ComponentFixture<PortInReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortInReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortInReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
