import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsayoItem } from './ensayo-item';

describe('EnsayoItem', () => {
  let component: EnsayoItem;
  let fixture: ComponentFixture<EnsayoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnsayoItem],
    }).compileComponents();

    fixture = TestBed.createComponent(EnsayoItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
