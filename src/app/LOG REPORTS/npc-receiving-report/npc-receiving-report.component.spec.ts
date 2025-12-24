import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcReceivingReportComponent } from './npc-receiving-report.component';

describe('NpcReceivingReportComponent', () => {
  let component: NpcReceivingReportComponent;
  let fixture: ComponentFixture<NpcReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcReceivingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
