import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectByDonorReportComponent } from './reject-by-donor-report.component';

describe('RejectByDonorReportComponent', () => {
  let component: RejectByDonorReportComponent;
  let fixture: ComponentFixture<RejectByDonorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectByDonorReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectByDonorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
