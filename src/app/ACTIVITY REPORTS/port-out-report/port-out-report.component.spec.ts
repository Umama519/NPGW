import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortOutReportComponent } from './port-out-report.component';

describe('PortOutReportComponent', () => {
  let component: PortOutReportComponent;
  let fixture: ComponentFixture<PortOutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortOutReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
