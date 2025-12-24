import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionReportComponent } from './user-action-report.component';

describe('UserActionReportComponent', () => {
  let component: UserActionReportComponent;
  let fixture: ComponentFixture<UserActionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
