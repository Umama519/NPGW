import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignActionComponent } from './role-assign-action.component';

describe('RoleAssignActionComponent', () => {
  let component: RoleAssignActionComponent;
  let fixture: ComponentFixture<RoleAssignActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAssignActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
