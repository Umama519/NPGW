import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSetupComponent } from './user-profile-setup.component';

describe('UserProfileSetupComponent', () => {
  let component: UserProfileSetupComponent;
  let fixture: ComponentFixture<UserProfileSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
