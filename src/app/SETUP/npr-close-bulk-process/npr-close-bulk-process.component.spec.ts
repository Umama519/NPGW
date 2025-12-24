import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprCloseBulkProcessComponent } from './npr-close-bulk-process.component';

describe('NprCloseBulkProcessComponent', () => {
  let component: NprCloseBulkProcessComponent;
  let fixture: ComponentFixture<NprCloseBulkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NprCloseBulkProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NprCloseBulkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
