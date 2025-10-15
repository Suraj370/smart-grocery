import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGrocery } from './create-grocery';

describe('CreateGrocery', () => {
  let component: CreateGrocery;
  let fixture: ComponentFixture<CreateGrocery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGrocery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGrocery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
