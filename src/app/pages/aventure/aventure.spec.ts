import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aventure } from './aventure';

describe('Aventure', () => {
  let component: Aventure;
  let fixture: ComponentFixture<Aventure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aventure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aventure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
