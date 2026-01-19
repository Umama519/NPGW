import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprResendBulkResponseComponent } from './npr-resend-bulk-response.component';

describe('NprResendBulkResponseComponent', () => {
  let component: NprResendBulkResponseComponent;
  let fixture: ComponentFixture<NprResendBulkResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprResendBulkResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprResendBulkResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
