import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowdefinitiondeactivationComponent } from './workflowdefinitiondeactivation.component';

describe('WorkflowdefinitiondeactivationComponent', () => {
  let component: WorkflowdefinitiondeactivationComponent;
  let fixture: ComponentFixture<WorkflowdefinitiondeactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowdefinitiondeactivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowdefinitiondeactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
