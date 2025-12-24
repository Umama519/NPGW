import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprCurrentBulkStatusComponent } from './npr-current-bulk-status.component';

describe('NprCurrentBulkStatusComponent', () => {
  let component: NprCurrentBulkStatusComponent;
  let fixture: ComponentFixture<NprCurrentBulkStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprCurrentBulkStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprCurrentBulkStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
