import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './testapi.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderSubject = new BehaviorSubject<any[]>([]);
  order$: Observable<any[]> = this.orderSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchOrder();
  }

  fetchOrder() {
    this.apiService.getOrder().subscribe(
      (response) => {
        this.orderSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  addOrder(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.addOrder(item).subscribe(
        (response) => {
          const neworder = this.orderSubject.value.concat(item);
          this.orderSubject.next(neworder);
          console.log('Added order', response);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  deleteorder(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.deleteOrder(id).subscribe(
        (response) => {
          const updatedCart = this.orderSubject.value.filter(
            (item) => item.id !== id
          );
          this.orderSubject.next(updatedCart);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  updateorder(id: string, updatedData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updatedorder = this.orderSubject.getValue().map((item) => {
        if (item.id === id) {
          return updatedData;
        }
        return item;
      });

      this.orderSubject.next(updatedorder);
      this.apiService.updateOrder(id, updatedData).subscribe(
        (response) => {
          console.log('order updated', response);
          resolve(true);
        },
        (error) => {
          console.error('Error in order updation:', error);
          resolve(false);
        }
      );
    });
  }

  
}
