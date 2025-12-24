import { ComponentFixture, TestBed } from '@angular/core/testing';

import { npdisconnectComponent } from './np-disconnect.component';

describe('npdisconnectComponent', () => {
  let component: npdisconnectComponent;
  let fixture: ComponentFixture<npdisconnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [npdisconnectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(npdisconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
