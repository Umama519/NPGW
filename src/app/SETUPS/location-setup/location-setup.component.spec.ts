import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSetupComponent } from './location-setup.component';

describe('LocationSetupComponent', () => {
  let component: LocationSetupComponent;
  let fixture: ComponentFixture<LocationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
