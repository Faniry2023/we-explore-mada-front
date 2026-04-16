import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProd } from './add-prod';

describe('AddProd', () => {
  let component: AddProd;
  let fixture: ComponentFixture<AddProd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
