import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpRequestComponent } from './np-request.component';

describe('NpRequestComponent', () => {
  let component: NpRequestComponent;
  let fixture: ComponentFixture<NpRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
