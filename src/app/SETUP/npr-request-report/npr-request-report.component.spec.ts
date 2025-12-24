import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprRequestReportComponent } from './npr-request-report.component';

describe('NprRequestReportComponent', () => {
  let component: NprRequestReportComponent;
  let fixture: ComponentFixture<NprRequestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprRequestReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
