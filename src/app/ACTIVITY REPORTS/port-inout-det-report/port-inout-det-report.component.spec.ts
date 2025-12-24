import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortInoutDetReportComponent } from './port-inout-det-report.component';

describe('PortInoutDetReportComponent', () => {
  let component: PortInoutDetReportComponent;
  let fixture: ComponentFixture<PortInoutDetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortInoutDetReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortInoutDetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
