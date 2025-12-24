import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCodeSetupComponent } from './error-code-setup.component';

describe('ErrorCodeSetupComponent', () => {
  let component: ErrorCodeSetupComponent;
  let fixture: ComponentFixture<ErrorCodeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorCodeSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorCodeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
