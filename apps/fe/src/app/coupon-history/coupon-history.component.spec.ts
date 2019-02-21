import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponHistoryComponent } from './coupon-history.component';

describe('CouponHistoryComponent', () => {
  let component: CouponHistoryComponent;
  let fixture: ComponentFixture<CouponHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
