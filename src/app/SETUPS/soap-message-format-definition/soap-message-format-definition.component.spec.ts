import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapMessageFormatDefinitionComponent } from './soap-message-format-definition.component';

describe('SoapMessageFormatDefinitionComponent', () => {
  let component: SoapMessageFormatDefinitionComponent;
  let fixture: ComponentFixture<SoapMessageFormatDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoapMessageFormatDefinitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoapMessageFormatDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
