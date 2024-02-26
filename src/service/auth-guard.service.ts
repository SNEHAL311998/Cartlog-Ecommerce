import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private authSubject = new BehaviorSubject<boolean>(false);
  auth$: Observable<boolean> = this.authSubject.asObservable();
  
  constructor() { 
    this.getCheckoutStatus();
  }

  updateCheckoutStatus(status: boolean) {
    this.authSubject.next(status);
  }

  getCheckoutStatus() {
    return this.authSubject.value;
  }
}
