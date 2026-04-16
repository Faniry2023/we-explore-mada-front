import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefSpeVille } from './def-spe-ville';

describe('DefSpeVille', () => {
  let component: DefSpeVille;
  let fixture: ComponentFixture<DefSpeVille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefSpeVille]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefSpeVille);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
