import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberingPlanSetupComponent } from './numbering-plan-setup.component';

describe('NumberingPlanSetupComponent', () => {
  let component: NumberingPlanSetupComponent;
  let fixture: ComponentFixture<NumberingPlanSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberingPlanSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberingPlanSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
