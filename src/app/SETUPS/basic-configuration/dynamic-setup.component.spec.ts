import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupComponent } from './dynamic-setup.component';

describe('DynamicSetupComponent', () => {
  let component: DynamicSetupComponent;
  let fixture: ComponentFixture<DynamicSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
