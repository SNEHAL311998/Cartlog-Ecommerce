import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './testapi.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private walletSubject = new BehaviorSubject<any[]>([]);
  wallet$: Observable<any[]> = this.walletSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchWallet();
  }

  fetchWallet() {
    this.apiService.getWallet().subscribe(
      (response) => {
        this.walletSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  addWallet(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.addWallet(item).subscribe(
        (response) => {
          const newWallet = this.walletSubject.value.concat(item);
          this.walletSubject.next(newWallet);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  updateWallet(id: string, updatedData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updateWallet = this.walletSubject.getValue().map((item) => {
        if (item.id === id) {
          return updatedData;
        }
        return item;
      });

      this.walletSubject.next(updateWallet);
      this.apiService.updateWallet(id, updatedData).subscribe(
        (response) => {
          console.log('Wallet updated', response);
          resolve(true);
        },
        (error) => {
          console.error('Error in Wallet updation:', error);
          resolve(false);
        }
      );
    });
  }
}
