import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprResendSolerrResponseComponent } from './npr-resend-solerr-response.component';

describe('NprResendSolerrResponseComponent', () => {
  let component: NprResendSolerrResponseComponent;
  let fixture: ComponentFixture<NprResendSolerrResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprResendSolerrResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprResendSolerrResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
