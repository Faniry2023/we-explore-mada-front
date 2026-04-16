import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prod } from './prod';

describe('Prod', () => {
  let component: Prod;
  let fixture: ComponentFixture<Prod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
