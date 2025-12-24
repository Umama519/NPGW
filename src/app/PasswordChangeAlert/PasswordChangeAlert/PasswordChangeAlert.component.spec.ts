import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeAlertComponent } from './PasswordChangeAlert.component';

describe('PasswordChangeAlertComponent', () => {
  let component: PasswordChangeAlertComponent;
  let fixture: ComponentFixture<PasswordChangeAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordChangeAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangeAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
