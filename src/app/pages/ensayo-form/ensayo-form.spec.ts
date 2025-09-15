import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsayoForm } from './ensayo-form';

describe('EnsayoForm', () => {
  let component: EnsayoForm;
  let fixture: ComponentFixture<EnsayoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnsayoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnsayoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
