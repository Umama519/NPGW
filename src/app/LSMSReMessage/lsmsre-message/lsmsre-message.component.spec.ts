import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LSMSReMessageComponent } from './lsmsre-message.component';

describe('LSMSReMessageComponent', () => {
  let component: LSMSReMessageComponent;
  let fixture: ComponentFixture<LSMSReMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LSMSReMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LSMSReMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
