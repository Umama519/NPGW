import { ComponentFixture, TestBed } from '@angular/core/testing';

import { npcancelComponent } from './np-cancel.component';

describe('npcancelComponent', () => {
  let component: npcancelComponent;
  let fixture: ComponentFixture<npcancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [npcancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(npcancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
