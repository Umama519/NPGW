import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IwPortingHistoryReportComponent } from './iw-porting-history-report.component';

describe('IwPortingHistoryReportComponent', () => {
  let component: IwPortingHistoryReportComponent;
  let fixture: ComponentFixture<IwPortingHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IwPortingHistoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IwPortingHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
