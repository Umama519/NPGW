import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LsmsReportComponent } from './lsms-report.component';

describe('LsmsReportComponent', () => {
  let component: LsmsReportComponent;
  let fixture: ComponentFixture<LsmsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LsmsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LsmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
