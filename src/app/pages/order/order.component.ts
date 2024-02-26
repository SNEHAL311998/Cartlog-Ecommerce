import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CartService } from 'src/service/cart.service';
import { WishlistService } from 'src/service/wishlist.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  data: any;
  @Input() location: string;
  @Input() fromCheckout: boolean;
  content: string;
  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef
  ) {
    this.location = 'wishlist';
    this.content = '';
    this.fromCheckout = false;
  }

  ngOnInit() {
    if (this.location === 'wishlist') {
      this.wishlistService.wishlist$.subscribe((data: any) => {
        this.data = data;
        this.cdRef.detectChanges();
      });
    } else {
      this.cartService.cart$.subscribe((data: any) => {
        this.data = data;
        this.cdRef.detectChanges();
      });
    }
    this.content = this.location === 'wishlist' ? 'Wishlist' : 'Cart';
  }

  handleClick() {
    console.log(this.data);
  }
}
