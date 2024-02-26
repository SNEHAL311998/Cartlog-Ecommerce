import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from './testapi.service';
import { WishlistService } from './wishlist.service';
import { CartService } from './cart.service';
import { getAllProductsApi, updateProduct } from 'src/utils/apiService';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  
  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private wishlistService: WishlistService,
    private cartService: CartService
    ) {

    // this.getAllProducts();
  }

  addToList(item: any, type: string, location?: string): void {
    if (type === 'wishlist') {
      item.isWishlisted = true;
      this.renderToastState(item, type, 'add', location);
    } else if (type === 'cart') {
      item.isAddtoCart = true;
      this.renderToastState(item, type, 'add', location);
    }
    this.updateProductFunc(item.category, item.id, item);
  }

  removeList(item: any, type: string, location?: string): void {
    if (type === 'wishlist') {
      item.isWishlisted = false;
      this.renderToastState(item, type, 'remove', location);
    } else if (type === 'cart') {
      item.isAddtoCart = false;
      this.renderToastState(item, type, 'remove', location);
    }
    this.updateProductFunc(item.category, item.id, item);
  }

  renderToastState(item: any, type: string, state: string, location?: string) {
    if (type === 'wishlist') {
      if (state === 'add') {
        this.addToWishlist(item, location);
      } else if (state === 'remove') {
        this.deleteWishlist(item.id, location);
      }
    } else if (type === 'cart') {
      if (state === 'add') {
        this.addToCart(item, location);
      } else if (state === 'remove') {
        this.deleteCart(item.id, location);
      }
    }
  }

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

  addOrder(data: string) {
    this.apiService.addOrder(data).subscribe(
      (data) => {
        console.log('Order added successfully', data);
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  addToWishlist(item: any, location?: string) {
    this.wishlistService.addToWishlist(item).then((result) => {
      if (result) {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Added',
            detail: 'Product added to Wishlist',
          });
        }
      } else {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt add to Wishlist',
          });
        }
      }
    });
  }

  deleteWishlist(id: string, location?: string) {
    this.wishlistService.deleteFromWishlist(id).then((result) => {
      if (result) {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Removed',
            detail: 'Product removed from Wishlist',
          });
        }
      } else {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt remove from Wishlist',
          });
        }
      }
    });
  }

  addToCart(item: any, location?: string) {
    item.qty = item.qty ? item.qty : 1;
    this.cartService.addToCart(item).then((result) => {
      if (result) {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Added',
            detail: 'Product added to Cart',
          });
        }
      } else {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt add to Wishlist',
          });
        }
      }
    });
  }

  deleteCart(id: string, location?: string) {
    this.cartService.deleteFromCart(id).then((result) => {
      if (result) {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Removed',
            detail: 'Product removed from Cart',
          });
        }
      } else {
        if (location !== 'order') {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt remove from Cart',
          });
        }
      }
    });
  }

  // deleteCart(id: string, location?: string) {
  //   this.cartService.deleteFromCart(id)
  //     .subscribe((result:any) => {
  //       if (result) {
  //         if (location !== 'order') {
  //           this.messageService.clear();
  //           this.messageService.add({
  //             key: 'tc',
  //             severity: 'success',
  //             summary: 'Removed',
  //             detail: 'Product removed from Cart',
  //           });
  //         }
  //       } else {
  //         if (location !== 'order') {
  //           this.messageService.clear();
  //           this.messageService.add({
  //             key: 'tc',
  //             severity: 'error',
  //             detail: 'Couldnt remove from Cart',
  //           });
  //         }
  //       }
  //     })
  // }
}
