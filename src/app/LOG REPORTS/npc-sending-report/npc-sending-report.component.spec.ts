import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcSendingReportComponent } from './npc-sending-report.component';

describe('NpcSendingReportComponent', () => {
  let component: NpcSendingReportComponent;
  let fixture: ComponentFixture<NpcSendingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcSendingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcSendingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
