import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualnprSendingComponent } from './manualnpr-sending.component';

describe('ManualnprSendingComponent', () => {
  let component: ManualnprSendingComponent;
  let fixture: ComponentFixture<ManualnprSendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualnprSendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualnprSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
