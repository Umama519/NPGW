import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalLovComponent } from './global-lov.component';

describe('GlobalLovComponent', () => {
  let component: GlobalLovComponent;
  let fixture: ComponentFixture<GlobalLovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalLovComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
