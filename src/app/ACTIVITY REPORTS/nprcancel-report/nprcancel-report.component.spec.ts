import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprcancelReportComponent } from './nprcancel-report.component';

describe('NprcancelReportComponent', () => {
  let component: NprcancelReportComponent;
  let fixture: ComponentFixture<NprcancelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprcancelReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprcancelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
