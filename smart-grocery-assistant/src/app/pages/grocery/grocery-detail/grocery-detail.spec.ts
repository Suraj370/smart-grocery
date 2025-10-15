import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryDetail } from './grocery-detail';

describe('GroceryDetail', () => {
  let component: GroceryDetail;
  let fixture: ComponentFixture<GroceryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
