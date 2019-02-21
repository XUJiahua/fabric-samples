import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Coupon } from '../coupon';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  coupons: Coupon[];
  selectedCoupon: Coupon;
  constructor(private couponService: CouponService, private router: Router) {}

  ngOnInit() {
    this.getCoupons();
  }

  getCoupons() {
    this.couponService
      .getCoupons('0001', '9999')
      .subscribe(coupons => (this.coupons = coupons));
  }

  onSelect(coupon: Coupon): void {
    this.selectedCoupon = coupon;
  }

  onRowSelect(event) {
    console.log(event.data);
    this.router.navigate(['/coupon/' + event.data.code]);
  }

  onRowUnselect(event) {
    console.log(event.data);
  }
}
