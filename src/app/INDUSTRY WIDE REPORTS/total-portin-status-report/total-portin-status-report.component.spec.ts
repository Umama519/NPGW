import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPortinStatusReportComponent } from './total-portin-status-report.component';

describe('TotalPortinStatusReportComponent', () => {
  let component: TotalPortinStatusReportComponent;
  let fixture: ComponentFixture<TotalPortinStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPortinStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPortinStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
