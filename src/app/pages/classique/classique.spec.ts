import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Classique } from './classique';

describe('Classique', () => {
  let component: Classique;
  let fixture: ComponentFixture<Classique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Classique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Classique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
