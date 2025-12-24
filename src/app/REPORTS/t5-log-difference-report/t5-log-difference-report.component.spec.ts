import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T5LogDifferenceReportComponent } from './t5-log-difference-report.component';

describe('T5LogDifferenceReportComponent', () => {
  let component: T5LogDifferenceReportComponent;
  let fixture: ComponentFixture<T5LogDifferenceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T5LogDifferenceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T5LogDifferenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
