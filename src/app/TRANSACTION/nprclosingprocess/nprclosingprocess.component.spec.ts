import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PINPOTVIEWComponent } from './pinpotview.component';

describe('PINPOTVIEWComponent', () => {
  let component: PINPOTVIEWComponent;
  let fixture: ComponentFixture<PINPOTVIEWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PINPOTVIEWComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PINPOTVIEWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
