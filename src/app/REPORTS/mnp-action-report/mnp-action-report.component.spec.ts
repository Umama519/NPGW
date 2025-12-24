import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnpActionReportComponent } from './mnp-action-report.component';

describe('MnpActionReportComponent', () => {
  let component: MnpActionReportComponent;
  let fixture: ComponentFixture<MnpActionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MnpActionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MnpActionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
