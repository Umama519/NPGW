import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationStatusReportComponent } from './integration-status-report.component';

describe('IntegrationStatusReportComponent', () => {
  let component: IntegrationStatusReportComponent;
  let fixture: ComponentFixture<IntegrationStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
