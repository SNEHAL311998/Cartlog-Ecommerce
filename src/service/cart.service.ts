import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from './testapi.service';
import { CommonService } from './common.service';
import { updateProduct } from 'src/utils/apiService';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$: Observable<any[]> = this.cartSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.fetchCartData();
  }

  fetchCartData() {
    this.apiService.getCart().subscribe(
      (response) => {
        this.cartSubject.next(response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // updateProductFunc(category: string, id: string, updatedData: any) {
  //   updateProduct(category, this.apiService, id, updatedData).subscribe(
  //     (response) => {
  //       console.log('product updated successfully', response);
  //     },
  //     (error) => {
  //       console.error('Error in updation:', error);
  //     }
  //   );
  // }
  // updateProductFunc=async (
  //   category: string,
  //   id: string,
  //   updatedData: any
  // ): Promise<any>=> {
  //   return await new Promise((resolve, reject) => {
  //     updateProduct(category, this.apiService, id, updatedData).subscribe(
  //       (response) => {
  //         resolve(response);
  //       },
  //       (error) => {
  //         console.error('Error in updateProductFunc:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  // async updateProductFunc(
  //   category: string,
  //   id: string,
  //   updatedData: any
  // ): Promise<any> {
  //   try {
  //     const response = await new Promise((resolve, reject) => {
  //       updateProduct(category, this.apiService, id, updatedData).subscribe(
  //         (data) => {
  //           resolve(data);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     });

  //     console.log('Success:', response);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in updateProductFunc:', error);
  //     throw error;
  //   }
  // }

  updateProductFunc(category: string, id: string, updatedData: any) {
    updateProduct(category, this.apiService, id, updatedData).subscribe(
      (response) => {
        console.log('product updated successfully', response);
      },
      (error) => {
        console.error('Error in updation:', error);
      }
    );
  }

  updateCart(id: string, updatedData: any) {
    const updatedCart = this.cartSubject.getValue().map((item) => {
      if (item.id === id) {
        return updatedData;
      }
      return item;
    });

    this.cartSubject.next(updatedCart);
    this.apiService.updateCart(id, updatedData).subscribe(
      (response) => {
        console.log('cart updated', response);
      },
      (error) => {
        console.error('Error in order updation:', error);
      }
    );
  }

  addToCart(item: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.postCart(item).subscribe(
        (response) => {
          const updatedWishlist = this.cartSubject.value.concat(item);
          this.cartSubject.next(updatedWishlist);
          console.log('Added cart', response);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  // deleteFromCart(id: any): Observable<boolean> {
  //   return this.apiService.deleteCart(id).pipe(
  //     map(() => {
  //       const updatedCart = this.cartSubject.value.filter(
  //         (item) => item.id !== id
  //       );
  //       this.cartSubject.next(updatedCart);
  //       return true;
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error:', error);
  //       return of(false); // Use 'of' to create an observable with 'false'.
  //     })
  //   );
  // }
  deleteFromCart(id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService.deleteCart(id).subscribe(
        (response) => {
          const updatedCart = this.cartSubject.value.filter(
            (item) => item.id !== id
          );
          this.cartSubject.next(updatedCart);
          resolve(true);
        },
        (error) => {
          console.error('Error:', error);
          resolve(false);
        }
      );
    });
  }

  // clearAllCart = async (cartItem: any) => {
  //   await this.deleteFromCart(cartItem.id)
  //     .then(async (res) => {
  //       if (res) {
  //         cartItem.isAddtoCart = false;
  //         return await this.updateProductFunc(
  //           cartItem.category,
  //           cartItem.id,
  //           cartItem
  //         );
  //       } else {
  //         console.log('Error in deleteFromCart...');
  //         return null;
  //       }
  //     })
  //     .then((response) => {
  //       if (response) {
  //         console.log('Success:', response);
  //       } else {
  //         console.log('Error in updateProductFunc...');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };

  async clearAllCart(cartItem: any) {
    await this.apiService.deleteCart(cartItem.id).subscribe(
      (response) => {
        const updatedCart = this.cartSubject.value.filter(
          (item) => item.id !== cartItem.id
        );
        this.cartSubject.next(updatedCart);
        // resolve(true);
      },
      (error) => {
        console.error('Error:', error);
        // resolve(false);
      }
      );
      // this.deleteFromCart(cartItem.id).then((res) => {
        //   if (res) {
    //     cartItem.isAddtoCart = false;
    //     this.updateProductFunc(cartItem.category, cartItem.id, cartItem);
    //   } else {
    //     console.log('err...');
    //   }
    // });
    // console.log(cartItem);
  }

  async updateAllDeletedItem(cartItem:any){
    cartItem.isAddtoCart = false;
    await this.updateProductFunc(cartItem.category, cartItem.id, cartItem)
  }

  deleteAll(cartItems: any) {
    // const postsIdsArray = cartItem.map((post:any) => post.id);
    cartItems.forEach((cartItem: any) => this.updateAllDeletedItem(cartItem));
    cartItems.forEach((cartItem: any) => this.clearAllCart(cartItem));
  }
}