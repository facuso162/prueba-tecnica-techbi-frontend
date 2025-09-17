import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaItem } from './prueba-item';

describe('PruebaItem', () => {
  let component: PruebaItem;
  let fixture: ComponentFixture<PruebaItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
