import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XMLPacketObjectSetupComponent } from './xmlpacket-object-setup.component';

describe('XMLPacketObjectSetupComponent', () => {
  let component: XMLPacketObjectSetupComponent;
  let fixture: ComponentFixture<XMLPacketObjectSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XMLPacketObjectSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XMLPacketObjectSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
