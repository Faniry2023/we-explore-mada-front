import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rand } from './rand';

describe('Rand', () => {
  let component: Rand;
  let fixture: ComponentFixture<Rand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
