import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './testapi.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressSubject = new BehaviorSubject<any[]>([]);
  address$: Observable<any[]> = this.addressSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchAddress();
  }

  fetchAddress() {
    this.apiService.getAddress().subscribe(
      (response) => {
        this.addressSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  addAdress(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.addAddress(item).subscribe(
        (response) => {
          const newAddress = this.addressSubject.value.concat(item);
          this.addressSubject.next(newAddress);
          console.log('Added address', response);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  deleteAddress(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.deleteAddress(id).subscribe(
        (response) => {
          const updatedCart = this.addressSubject.value.filter(
            (item) => item.id !== id
          );
          this.addressSubject.next(updatedCart);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  updateAddress(id: string, updatedData: any):Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updatedAddress = this.addressSubject.getValue().map((item) => {
        if (item.id === id) {
          return updatedData;
        }
        return item;
      });
  
      this.addressSubject.next(updatedAddress);
      this.apiService.updateAddress(id, updatedData).subscribe(
        (response) => {
          console.log('Address updated', response);
          resolve(true);
        },
        (error) => {
          console.error('Error in address updation:', error);
          resolve(false);
        }
      );
    }
  )}
}
