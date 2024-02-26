import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './testapi.service';

@Injectable({
  providedIn: 'root',
})
export class GiftcardService {
  private giftSubject = new BehaviorSubject<any[]>([]);
  gift$: Observable<any[]> = this.giftSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchGiftCard();
  }

  fetchGiftCard() {
    this.apiService.getGiftCard().subscribe(
      (response) => {
        this.giftSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  addGiftCard(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.addGiftCard(item).subscribe(
        (response) => {
          const neworder = this.giftSubject.value.concat(item);
          this.giftSubject.next(neworder);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  deleteGiftCard(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.deleteGiftCard(id).subscribe(
        (response) => {
          const updatedGiftCard = this.giftSubject.value.filter(
            (item) => item.id !== id
          );
          this.giftSubject.next(updatedGiftCard);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  updatedGiftCard(id: string, updatedData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updatedGift = this.giftSubject.getValue().map((item) => {
        if (item.id === id) {
          return updatedData;
        }
        return item;
      });

      this.giftSubject.next(updatedGift);
      this.apiService.updateGiftCard(id, updatedData).subscribe(
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
