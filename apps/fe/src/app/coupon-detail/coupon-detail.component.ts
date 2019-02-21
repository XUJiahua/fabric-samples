import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Coupon } from '../coupon';
import { ActivatedRoute } from '@angular/router';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-coupon-detail',
  templateUrl: './coupon-detail.component.html',
  styleUrls: ['./coupon-detail.component.css']
})
export class CouponDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private couponService: CouponService,
    private location: Location
  ) {}
  // @Input() coupon: Coupon;
  @Output() deleteCoupon: EventEmitter<Coupon> = new EventEmitter();
  coupon: Coupon;

  display = false;
  display2 = false;

  @Input() user: string;

  ngOnInit() {
    this.getCoupon();
  }

  getCoupon() {
    const code = this.route.snapshot.paramMap.get('code');
    this.couponService
      .getCoupon(code)
      .subscribe(coupon => (this.coupon = coupon));
  }

  goBack(): void {
    this.location.back();
  }

  onDelete(): void {
    this.display = false;
    this.deleteCoupon.emit(this.coupon);

    this.couponService.removeCoupon(this.coupon.code).subscribe(data => {
      console.log(data);
      this.goBack();
    });
  }

  onTransfer(): void {
    this.display2 = false;

    this.couponService
      .transferCoupon(this.coupon.code, this.user)
      .subscribe(data => {
        console.log(data);
        this.goBack();
      });
  }

  showDeleteDialog() {
    this.display = true;
  }

  showTransferDialog() {
    this.display2 = true;
    // this.user = ""
  }
}
