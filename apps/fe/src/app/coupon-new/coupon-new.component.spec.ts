import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponNewComponent } from './coupon-new.component';

describe('CouponNewComponent', () => {
  let component: CouponNewComponent;
  let fixture: ComponentFixture<CouponNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
