import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovDropdownComponent } from './lov-dropdown.component';

describe('LovDropdownComponent', () => {
  let component: LovDropdownComponent;
  let fixture: ComponentFixture<LovDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
