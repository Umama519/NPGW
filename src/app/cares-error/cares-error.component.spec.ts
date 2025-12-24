import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaresErrorComponent } from './cares-error.component';

describe('CaresErrorComponent', () => {
  let component: CaresErrorComponent;
  let fixture: ComponentFixture<CaresErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaresErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaresErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
