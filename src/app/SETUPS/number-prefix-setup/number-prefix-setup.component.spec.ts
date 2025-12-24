import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberPrefixSetupComponent } from './number-prefix-setup.component';

describe('NumberPrefixSetupComponent', () => {
  let component: NumberPrefixSetupComponent;
  let fixture: ComponentFixture<NumberPrefixSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberPrefixSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberPrefixSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
