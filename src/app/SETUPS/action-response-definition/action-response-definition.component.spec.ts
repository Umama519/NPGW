import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionResponseDefinitionComponent } from './action-response-definition.component';

describe('ActionResponseDefinitionComponent', () => {
  let component: ActionResponseDefinitionComponent;
  let fixture: ComponentFixture<ActionResponseDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionResponseDefinitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionResponseDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
