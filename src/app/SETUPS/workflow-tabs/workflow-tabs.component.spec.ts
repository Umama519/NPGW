import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTabsComponent } from './workflow-tabs.component';

describe('WorkflowTabsComponent', () => {
  let component: WorkflowTabsComponent;
  let fixture: ComponentFixture<WorkflowTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
