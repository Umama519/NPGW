import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprManualBulkProcessComponent } from './npr-manual-bulk-process.component';

describe('NprManualBulkProcessComponent', () => {
  let component: NprManualBulkProcessComponent;
  let fixture: ComponentFixture<NprManualBulkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprManualBulkProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprManualBulkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
