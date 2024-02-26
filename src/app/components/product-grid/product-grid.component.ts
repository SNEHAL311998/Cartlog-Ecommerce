import { Component, Input } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
import { CartService } from 'src/service/cart.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent {
  like: boolean = false;
  toastRender: boolean = false;
  selectedSize: any = '';
  qty: number = 1;
  @Input() data: any;
  @Input() gridlayout: any;
  @Input() location: any;
  @Input() fromCart: boolean;
  @Input() fromCheckout: boolean;

  constructor(
    private commonService: CommonService,
    private cartService: CartService,
    private router: Router
  ) {
    this.data;
    this.gridlayout = 'grid';
    this.fromCart = false;
    this.fromCheckout = false;
  }

  ngOnInit() {
    // this.data.forEach((item: any) => {
    //   item.qty = 1;
    //   this.commonService.updateCart(item.id, item);
    // });
    console.log(this.data);
  }

  currentClass(size: string, item: any): string {
    return size === item.selectedSize
      ? 'liststyle-size-click'
      : 'liststyle-size';
  }

  handleFunction(type: string, item: any, value?: any) {
    if (type === 'wishlist') {
      if (item.isWishlisted) {
        this.commonService.removeList(item, type, this.location);
      } else {
        this.commonService.addToList(item, type, this.location);
      }
    } else if (type === 'cart') {
      if (item.isAddtoCart) {
        item.selectedSize = '';
        item.qty = 1;
        this.commonService.removeList(item, type, this.location);
      } else {
        this.commonService.addToList(item, type, this.location);
      }
    } else if (type === 'size') {
      // this.selectedSize = value;
      item.selectedSize = value;
      this.cartService.updateCart(item.id, item);
    } else if (type === 'qty') {
      // this.qty = 1;
      if (value === '-') {
        if (item.qty <= 1) return;
        item.qty--;
      }
      if (value === '+') {
        if (item.qty < 1) return;
        item.qty++;
      }
      // item.qty = this.qty;
      this.cartService.updateCart(item.id, item);
    }
  }
}
