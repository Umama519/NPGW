import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSetupComponent } from './operator-setup.component';

describe('OperatorSetupComponent', () => {
  let component: OperatorSetupComponent;
  let fixture: ComponentFixture<OperatorSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
