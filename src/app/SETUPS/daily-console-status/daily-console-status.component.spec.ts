import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyConsoleStatusComponent } from './daily-console-status.component';

describe('DailyConsoleStatusComponent', () => {
  let component: DailyConsoleStatusComponent;
  let fixture: ComponentFixture<DailyConsoleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyConsoleStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyConsoleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
