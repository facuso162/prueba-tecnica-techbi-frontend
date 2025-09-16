import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsayoEditForm } from './ensayo-edit-form';

describe('EnsayoEditForm', () => {
  let component: EnsayoEditForm;
  let fixture: ComponentFixture<EnsayoEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnsayoEditForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnsayoEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
