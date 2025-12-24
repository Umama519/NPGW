import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupSetupComponent } from './user-group-setup.component';

describe('UserGroupSetupComponent', () => {
  let component: UserGroupSetupComponent;
  let fixture: ComponentFixture<UserGroupSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
