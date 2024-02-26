import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './testapi.service';

@Injectable({
  providedIn: 'root',
})
export class RecentsearchService {
  private recentSubject = new BehaviorSubject<any[]>([]);
  recent$: Observable<any[]> = this.recentSubject.asObservable();
  constructor(private apiService: ApiService) {
    this.fetchRecent();
  }

  fetchRecent() {
    this.apiService.getRecent().subscribe(
      (response) => {
        this.recentSubject.next(response);
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  addRecent(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.addRecent(item).subscribe(
        (response) => {
          const newRecent = this.recentSubject.value.concat(item);
          this.recentSubject.next(newRecent);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  deleteRecent(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.deleteRecent(id).subscribe(
        (response) => {
          const updatedRecent = this.recentSubject.value.filter(
            (item) => item.id !== id
          );
          this.recentSubject.next(updatedRecent);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

}
