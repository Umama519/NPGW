import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcSoapSendingAgingReportComponent } from './npc-soap-sending-aging-report.component';

describe('NpcSoapSendingAgingReportComponent', () => {
  let component: NpcSoapSendingAgingReportComponent;
  let fixture: ComponentFixture<NpcSoapSendingAgingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcSoapSendingAgingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcSoapSendingAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
