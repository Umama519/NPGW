import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XMLPacketTypeDefinitionComponent } from './xmlpacket-type-definition.component';

describe('XMLPacketTypeDefinitionComponent', () => {
  let component: XMLPacketTypeDefinitionComponent;
  let fixture: ComponentFixture<XMLPacketTypeDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XMLPacketTypeDefinitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XMLPacketTypeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
