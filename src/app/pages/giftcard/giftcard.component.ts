import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { MessageService } from 'primeng/api';
import ShortUniqueId from 'short-unique-id';
import { AuthGuardService } from 'src/service/auth-guard.service';
import { CartService } from 'src/service/cart.service';
import { GiftcardService } from 'src/service/giftcard.service';

declare var Razorpay: any;
@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.scss'],
})
export class GiftcardComponent {
  tabState: number = 1;
  error: boolean = false;

  enteredAmount: any;
  enteredChip: any;
  selectedGift: any;
  allGifts: any;
  isOverlay: boolean = false;
  finalAmnt: number = 0;
  overlayStates: boolean[] = [];

  constructor(
    private authService: AuthGuardService,
    private cartService: CartService,
    private messageService: MessageService,
    private giftService: GiftcardService,
    private datePipe: DatePipe,
    private router: Router,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.finalAmnt = 0;
    this.giftService.gift$.subscribe((data) => {
      this.allGifts = data;
      console.log(this.allGifts);
    });
  }

  giftCards = [
    {
      images: ['../../../assets/gift-card-1.png'],
      color1: '#ED902C',
      color2: '#F4BC5D',
      name: 'Sunset Shimmer Gift Card',
    },
    {
      images: ['../../../assets/gift-card-3.png'],
      color1: '#A21759',
      color2: '#D16692',
      name: 'Rosey Radiance Gift Card',
    },
    {
      images: ['../../../assets/gift-card-2.png'],
      color1: '#61724E',
      color2: '#7E8E6D',
      name: 'Forest Serenity Gift Card',
    },
  ];

  finalAmount() {
    this.finalAmnt =
      this.enteredAmount || this.enteredChip
        ? this.enteredAmount || this.enteredChip
        : 0;
  }

  handlerFunc(response: any) {
    let redirect_url = '';
    if (
      typeof response.razorpay_payment_id == 'undefined' ||
      response.razorpay_payment_id === null
    ) {
      redirect_url = '/';
    } else {
      const uid = new ShortUniqueId({
        dictionary: 'alphanum_upper',
        length: 7,
      });
      let giftItem = {
        ...this.selectedGift,
        price: this.finalAmnt,
      };
      giftItem.expiry = this.generateExpiryDate();
      giftItem.code = `CRTLG` + uid.rnd();
      giftItem.id = Math.random().toString(16).slice(2);
      giftItem.isOverlay = false;
      giftItem.isUsed = false;
      this.giftService.addGiftCard(giftItem).then((result) => {
        if (result) {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'success',
            summary: 'Purchased',
            detail: 'Gift Card purchased Successfully',
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            detail: 'Couldnt add Gift Card',
          });
        }
      });

      // this.pointService.addPoints(this.finalAmount);
      redirect_url = '/giftcard';
    }
    location.href = redirect_url;
  }

  payNow() {
    const RazorpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: this.finalAmnt * 100,
      name: 'Cartlog',
      key: 'rzp_test_GDSj4cCXe0vwu8',
      handler: (response: any) => {
        this.handlerFunc(response);
      },
      image: 'https://img.logoipsum.com/245.svg',
      prefill: {
        name: 'Snehal',
        email: 'snehal@gmail.com',
        phone: '9898989898',
      },
      theme: {
        color: '#001524',
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed');
        },
      },
    };

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
      this.router.navigate(['/placed']);
    };

    const failureCallback = (e: any) => {
      console.log(e);
    };

    Razorpay.open(RazorpayOptions, successCallback, failureCallback);
  }

  generateExpiryDate(): string {
    const currentDate = new Date();

    const expiryDate = new Date(currentDate);
    expiryDate.setFullYear(currentDate.getFullYear() + 1);

    return (
      this.datePipe.transform(expiryDate, 'dd MMMM yyyy') ?? 'Invalid Date'
    );
  }

  handleFunc(type: string, value: any) {
    if (type === 'tab') {
      this.tabState = value || 1;
    } else if (type === 'chip') {
      this.enteredAmount = 0;
      this.enteredChip = value;
      this.error = false;
      this.finalAmount();
    } else if (type === 'buyAmount') {
      let amount = value.target.value;
      if (amount < 100 || amount > 10000) {
        this.error = true;
        if (amount > 10000) {
          value.target.value = '10000';
          this.error = false;
        }
        this.enteredAmount = value.target.value;
      } else {
        this.error = false;
      }
      this.enteredChip = 0;
      this.finalAmount();
    } else if (type === 'giftChoose') {
      this.selectedGift = value;
    } else if (type === 'buyNow') {
      this.payNow();
    } else if (type === 'copyGift') {
      if(!value.isUsed){
        this.clipboardService.copyFromContent(value.code);
        this.messageService.clear();
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Copied',
          detail: 'Gift code copied',
        });
      }
    } else if ('overlay') {
      this.overlayStates[value] = !this.overlayStates[value];
    }
  }
}
