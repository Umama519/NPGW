import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPortoutStatusReportComponent } from './total-portout-status-report.component';

describe('TotalPortoutStatusReportComponent', () => {
  let component: TotalPortoutStatusReportComponent;
  let fixture: ComponentFixture<TotalPortoutStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPortoutStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPortoutStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
