import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RedeempointsService {
  private points: number = JSON.parse(localStorage.getItem('redeem') || '0');

  constructor() {}

  addPoints(amount: number) {
    const earnedPoints = Math.floor(amount / 100) * 10;
    this.points += earnedPoints;
    localStorage.setItem('redeem', JSON.stringify(this.points));
  }

  getPoints() {
    // return this.points;
    return JSON.parse(localStorage.getItem('redeem') || '0');
  }

  redeemPoints(totalAmountSpent: number) {
    let discountPercentage = 0;
    this.points = JSON.parse(localStorage.getItem('redeem') || '0');

    if (totalAmountSpent >= 250 && totalAmountSpent <= 500) {
      discountPercentage = 2;
    } else if (totalAmountSpent > 500 && totalAmountSpent <= 1000) {
      discountPercentage = 5;
    } else if (totalAmountSpent > 1000 && totalAmountSpent <= 2000) {
      discountPercentage = 10;
    } else if (totalAmountSpent > 2000) {
      discountPercentage = 15;
    }

    const discount = Math.ceil((discountPercentage / 100) * this.points);
    this.points -= discount;
    localStorage.setItem('discountPoints', JSON.stringify(discount));
    return discount;
  }
}
