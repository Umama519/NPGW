import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRejectionReportComponent } from './current-rejection-report.component';

describe('CurrentRejectionReportComponent', () => {
  let component: CurrentRejectionReportComponent;
  let fixture: ComponentFixture<CurrentRejectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentRejectionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentRejectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
