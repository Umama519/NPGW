import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaresLogReportComponent } from './cares-log-report.component';

describe('CaresLogReportComponent', () => {
  let component: CaresLogReportComponent;
  let fixture: ComponentFixture<CaresLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaresLogReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaresLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
