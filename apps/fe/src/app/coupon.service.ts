import { Injectable } from '@angular/core';
import { Coupon, Transaction } from './coupon';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  couponUrl = 'http://localhost:4200/api';

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {}

  // getRange
  getCoupons(from: string, to: string): Observable<Coupon[]> {
    const url = `${this.couponUrl}/coupons?from=${from}&to=${to}`;
    return this.httpClient.get<Coupon[]>(url).pipe(
      tap(_ => this.log('fetch coupons')),
      catchError(this.handleError('getCoupons', []))
    );
  }

  // add
  addCoupon(coupon: Coupon): Observable<any> {
    const url = `${this.couponUrl}/coupon`;
    return this.httpClient.post(url, coupon).pipe(
      tap(_ => this.log(`add coupon code=${coupon.code}`)),
      catchError(this.handleError('addCoupon'))
    );
  }

  // get
  getCoupon(code: string): Observable<Coupon> {
    const url = `${this.couponUrl}/coupon/${code}`;
    return this.httpClient.get<Coupon>(url).pipe(
      tap(_ => this.log(`get coupon code=${code}`)),
      catchError(this.handleError<Coupon>('getCoupon'))
    );
  }

  // history
  getHistory(code: string): Observable<Transaction[]> {
    const url = `${this.couponUrl}/history/${code}`;
    return this.httpClient.get<Transaction[]>(url).pipe(
      tap(_ => this.log(`fetch coupon history code=${code}`)),
      catchError(this.handleError<Transaction[]>('getHistory'))
    );
  }

  // transfer
  transferCoupon(code: string, user: string): Observable<any> {
    const url = `${this.couponUrl}/transfer/${code}?user=${user}`;
    return this.httpClient.put(url, '').pipe(
      tap(_ => this.log(`transfer coupon code=${code}`)),
      catchError(this.handleError('transferCoupon'))
    );
  }

  // delete
  removeCoupon(code: string): Observable<any> {
    const url = `${this.couponUrl}/coupon/${code}`;
    return this.httpClient.delete(url).pipe(
      tap(_ => this.log(`remove coupon code=${code}`)),
      catchError(this.handleError('removeCoupon'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}, ${error.error}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CouponService: ${message}`);
  }
}
