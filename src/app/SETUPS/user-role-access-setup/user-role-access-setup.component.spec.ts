import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAccessSetupComponent } from './user-role-access-setup.component';

describe('UserRoleAccessSetupComponent', () => {
  let component: UserRoleAccessSetupComponent;
  let fixture: ComponentFixture<UserRoleAccessSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleAccessSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleAccessSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
