import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/service/testapi.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/service/common.service';
import { Subscription } from 'rxjs';
import { CartService } from 'src/service/cart.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Location } from '@angular/common';
import { ClipboardService } from 'ngx-clipboard';
@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  // providers: [MessageService],
})
export class SingleProductComponent {
  counterValue: number;
  imgValue: any = '';
  selectedSize: any = '';
  singleProductData: any;
  visible: boolean = false;
  id: string | null;
  isHalfStar: boolean;
  category: any;
  shareUrl: string = '';

  private routeSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartService,
    private location: Location,
    private clipboardService: ClipboardService
  ) {
    this.counterValue = 1;
    this.id = '';
    this.isHalfStar = false;
    this.category = '';

    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const catParam = params.get('category');
      this.category = catParam;

      if (idParam !== null) {
        this.id = idParam;
        if (catParam === 'mens') {
          this.apiService.getSingleMensProduct(this.id).subscribe(
            (data) => {
              this.singleProductData = data;
              this.imgValue = this.singleProductData.images[0];
            },
            (error) => {
              console.error('Error:', error);
            }
          );
        } else if (catParam === 'womens') {
          this.apiService.getSingleWomensProduct(this.id).subscribe(
            (data) => {
              this.singleProductData = data;
              this.imgValue = this.singleProductData.images[0];
            },
            (error) => {
              console.error('Error:', error);
            }
          );
        }
      }
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.shareUrl = 'http://localhost:4200' + this.location.path();
  }

  options: AnimationOptions = {
    path: 'https://lottie.host/7903f70b-6b05-4fa5-b3d8-05002d155d11/ZaCTa1fekh.json',
  };
  // onAnimate(animationItem: AnimationItem): void {
  //   console.log(animationItem);
  // }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  currentClass(size: string): string {
    return size === this.selectedSize
      ? 'singleProduct-size-click'
      : 'singleProduct-size';
  }
  imageClass(image: string): string {
    return image === this.imgValue
      ? 'singleImage-border'
      : 'singleImage-default';
  }
  handleFunction(type: string, value?: string, item?: any) {
    if (type === 'size') {
      this.selectedSize = value;
    } else if (type === 'image') {
      this.imgValue = value;
    } else if (type === 'qty') {
      if (value === '-') {
        if (this.counterValue <= 1) return;
        this.counterValue--;
      }
      if (value === '+') {
        if (this.counterValue < 1) return;
        this.counterValue++;
      }
      // this.commonService.addToCart(item);
    } else if (type === 'cart') {
      if (this.singleProductData?.isAddtoCart) {
        this.commonService.removeList(this.singleProductData, type);
      } else {
        this.singleProductData.qty = this.counterValue;
        this.singleProductData.selectedSize = this.selectedSize;
        this.commonService.addToList(this.singleProductData, type);
      }
    } else if (type === 'wishlist') {
      if (this.singleProductData?.isWishlisted) {
        this.commonService.removeList(this.singleProductData, type);
      } else {
        this.commonService.addToList(this.singleProductData, type);
      }
    } else if (type === 'share') {
      this.visible = true;
    } else if(type === 'copy'){
      this.clipboardService.copyFromContent(this.shareUrl);
      this.messageService.clear();
      this.messageService.add({
        key: 'tc',
        severity: 'success',
        summary: 'Copied',
        detail: 'Link copied',
      });
    }
  }
}
