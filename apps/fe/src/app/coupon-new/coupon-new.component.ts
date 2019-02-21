import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CouponService } from '../coupon.service';

import { Coupon } from '../coupon';
@Component({
  selector: 'app-coupon-new',
  templateUrl: './coupon-new.component.html',
  styleUrls: ['./coupon-new.component.css']
})
export class CouponNewComponent implements OnInit {
  @Input() coupon: Coupon;
  constructor(
    private couponService: CouponService,
    private location: Location
  ) {}

  ngOnInit() {
    this.coupon = new Coupon();
  }
  add() {
    console.log(this.coupon);
    this.couponService.addCoupon(this.coupon).subscribe(data => {
      console.log(data);
    });
  }
  goBack(): void {
    this.location.back();
  }
}
