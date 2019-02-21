import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../coupon';
import { CouponService } from '../coupon.service';
@Component({
  selector: 'app-coupon-history',
  templateUrl: './coupon-history.component.html',
  styleUrls: ['./coupon-history.component.css']
})
export class CouponHistoryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private couponService: CouponService
  ) {}

  transactions: Transaction[];
  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    const code = this.route.snapshot.paramMap.get('code');
    this.couponService.getHistory(code).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
