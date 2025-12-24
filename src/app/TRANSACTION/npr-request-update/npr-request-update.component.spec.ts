import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpRequestupdateComponent } from './npr-request-update.component';

describe('NpRequestupdateComponent', () => {
  let component: NpRequestupdateComponent;
  let fixture: ComponentFixture<NpRequestupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpRequestupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpRequestupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
