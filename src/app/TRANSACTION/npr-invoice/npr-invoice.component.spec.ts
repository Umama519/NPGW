import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NPRINVOICEComponent } from './npr-invoice.component';

describe('NPRINVOICEComponent', () => {
  let component: NPRINVOICEComponent;
  let fixture: ComponentFixture<NPRINVOICEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NPRINVOICEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NPRINVOICEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
