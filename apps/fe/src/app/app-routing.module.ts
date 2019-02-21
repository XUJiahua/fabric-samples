import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CouponsComponent } from './coupons/coupons.component';
import { CouponDetailComponent } from './coupon-detail/coupon-detail.component';
import { CouponNewComponent } from './coupon-new/coupon-new.component';

const routes: Routes = [
  { path: '', redirectTo: '/coupons', pathMatch: 'full' },
  { path: 'coupon', component: CouponNewComponent },
  { path: 'coupon/:code', component: CouponDetailComponent },
  { path: 'coupons', component: CouponsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
