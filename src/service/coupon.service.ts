import { Injectable } from '@angular/core';
import { ApiService } from './testapi.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private couponSubject = new BehaviorSubject<any[]>([]);
  coupon$: Observable<any[]> = this.couponSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchCoupon();
  }

  fetchCoupon() {
    this.apiService.getCoupon().subscribe(
      (response) => {
        this.couponSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  updatedCoupon(id: string, updatedData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updatedCoupon = this.couponSubject.getValue().map((item) => {
        if (item.id === id) {
          return updatedData;
        }
        return item;
      });

      this.couponSubject.next(updatedCoupon);
      this.apiService.updateCoupon(id, updatedData).subscribe(
        (response) => {
          console.log('Coupon updated', response);
          resolve(true);
        },
        (error) => {
          console.error('Error in coupon updation:', error);
          resolve(false);
        }
      );
    });
  }
}
