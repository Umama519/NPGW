import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitedErrorReportComponent } from './solicited-error-report.component';

describe('SolicitedErrorReportComponent', () => {
  let component: SolicitedErrorReportComponent;
  let fixture: ComponentFixture<SolicitedErrorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitedErrorReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitedErrorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
