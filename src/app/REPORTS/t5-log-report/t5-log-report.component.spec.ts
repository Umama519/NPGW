import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T5LogReportComponent } from './t5-log-report.component';

describe('T5LogReportComponent', () => {
  let component: T5LogReportComponent;
  let fixture: ComponentFixture<T5LogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T5LogReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T5LogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
