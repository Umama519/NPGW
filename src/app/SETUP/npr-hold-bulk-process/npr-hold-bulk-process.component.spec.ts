import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprHoldBulkProcessComponent } from './npr-hold-bulk-process.component';

describe('NprHoldBulkProcessComponent', () => {
  let component: NprHoldBulkProcessComponent;
  let fixture: ComponentFixture<NprHoldBulkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprHoldBulkProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprHoldBulkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
