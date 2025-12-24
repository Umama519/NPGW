import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmdLogReportComponent } from './pmd-log-report.component';

describe('PmdLogReportComponent', () => {
  let component: PmdLogReportComponent;
  let fixture: ComponentFixture<PmdLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmdLogReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmdLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
