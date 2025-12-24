import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprInvoiceReportComponent } from './npr-invoice-report.component';

describe('NprInvoiceReportComponent', () => {
  let component: NprInvoiceReportComponent;
  let fixture: ComponentFixture<NprInvoiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprInvoiceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
