import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaAddModal } from './prueba-add-modal';

describe('PruebaAddModal', () => {
  let component: PruebaAddModal;
  let fixture: ComponentFixture<PruebaAddModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaAddModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaAddModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
