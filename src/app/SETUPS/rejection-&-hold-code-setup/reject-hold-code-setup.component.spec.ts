import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectHoldCodeSetupComponent } from './reject-hold-code-setup.component';

describe('RejectHoldCodeSetupComponent', () => {
  let component: RejectHoldCodeSetupComponent;
  let fixture: ComponentFixture<RejectHoldCodeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectHoldCodeSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectHoldCodeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
