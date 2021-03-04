import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealedCardComponent } from './revealed-card.component';

describe('RevealedCardComponent', () => {
  let component: RevealedCardComponent;
  let fixture: ComponentFixture<RevealedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevealedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevealedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
