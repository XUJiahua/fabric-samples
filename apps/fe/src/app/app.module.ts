import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MessagesComponent } from "./messages/messages.component";
import { CouponsComponent } from "./coupons/coupons.component";
import { CouponDetailComponent } from "./coupon-detail/coupon-detail.component";
import { PaginatorModule } from "primeng/paginator";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { CouponNewComponent } from "./coupon-new/coupon-new.component";
import { DialogModule } from "primeng/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    PaginatorModule,
    TableModule,
    CardModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    MessagesComponent,
    CouponsComponent,
    CouponDetailComponent,
    CouponNewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
