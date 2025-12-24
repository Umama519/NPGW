import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprDisconnectBulkProcessComponent } from './npr-disconnect-bulk-process.component';

describe('NprDisconnectBulkProcessComponent', () => {
  let component: NprDisconnectBulkProcessComponent;
  let fixture: ComponentFixture<NprDisconnectBulkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprDisconnectBulkProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprDisconnectBulkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
