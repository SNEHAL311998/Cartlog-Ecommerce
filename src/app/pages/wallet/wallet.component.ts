import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GiftcardService } from 'src/service/giftcard.service';
import { WalletService } from 'src/service/wallet.service';

declare var Razorpay: any;
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  enteredChip: any;
  enteredAmount: number = 0;
  accountBalance: number = 0;
  finalAmnt: number = 0;
  giftAmount: number = 0;
  giftItem: any;
  error: boolean = false;
  errorCode: boolean = false;
  isLoader: boolean = false;
  giftCode: string = '';
  errorText: string = '';
  allGifts: any;
  allWallet: any;

  constructor(
    private router: Router,
    private giftService: GiftcardService,
    private walletService: WalletService,
    private messageService: MessageService
  ) {
    this.giftService.gift$.subscribe((data) => {
      this.allGifts = data;
    });
    this.walletService.wallet$.subscribe((data) => {
      this.allWallet = data;
      this.accountBalance = this.allWallet[0]?.value
        ? this.allWallet[0]?.value
        : 0;
      console.log(this.allWallet);
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

  handlerFunc(response: any) {
    let redirect_url = '';
    if (
      typeof response.razorpay_payment_id == 'undefined' ||
      response.razorpay_payment_id === null
    ) {
      redirect_url = '/';
    } else {
      this.addBalance(this.finalAmnt);
      redirect_url = '/wallet';
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
      this.router.navigate(['/wallet']);
    };

    const failureCallback = (e: any) => {
      console.log(e);
    };

    Razorpay.open(RazorpayOptions, successCallback, failureCallback);
  }

  handleFunc(type: string, value: any) {
    if (type === 'chip') {
      this.giftCode = '';
      this.enteredAmount = 0;
      this.enteredChip = value;
      this.error = false;
      this.finalAmount();
      this.giftAmount = 0;
    } else if (type === 'buyAmount') {
      this.giftCode = '';
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
    } else if (type === 'buyNow') {
      if (this.giftAmount) {
        this.isLoader = true;
        setTimeout(()=>{
          // let updatedGift = this.giftItem;
          // updatedGift.isUsed = true;
          this.isLoader = false;
          if(!this.giftItem.isUsed){
            this.giftService.updatedGiftCard(this.giftItem.id, this.giftItem);
            this.addBalance(this.giftAmount);
            this.giftItem.isUsed = true;
            this.messageService.clear();
            this.messageService.add({
              key: 'tc',
              severity: 'success',
              summary: 'Redeemed',
              detail: 'Gift Card Redeemed Successfully',
            });
          }else{
            this.messageService.clear();
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Already Used',
              detail: 'Gift Card already used',
            });

          }
          this.giftCode = '';
        },3000)
      } else {
        this.payNow();
      }
    } else if (type === 'addCode') {
      this.enteredAmount = 0;
      this.enteredChip = 0;
      let code = value.target.value;
      if (code.length < 12 || code.length > 12) {
        this.errorCode = true;
        this.errorText = 'Enter 12 digit code';
      } else {
        this.errorCode = false;
        this.giftCode = code;
        this.giftAmount = this.searchGiftCardByCode(code);
        this.giftItem = this.searchGiftCard(code);
        if (this.giftAmount === null) {
          this.errorCode = true;
          this.errorText = 'Invalid Gift Code';
          return;
        }
        this.finalAmount('gift', this.giftAmount);
      }
    }
  }

  finalAmount(type?: string, value?: any) {
    if (type === 'gift') {
      this.finalAmnt = value;
    } else {
      this.finalAmnt =
        this.enteredAmount || this.enteredChip
          ? this.enteredAmount || this.enteredChip
          : 0;
    }
  }

  addWallet(value: any) {
    let wallet = {
      value,
      id: Math.random().toString(16).slice(2),
    };
    this.walletService.addWallet(wallet).then((result) => {
      if (result) {
        console.log('added to wallet');
      } else {
        console.log('error in adding order');
      }
    });
  }

  editWallet(id: string, item: any) {
    let wallet = {
      value: item,
      id,
    };
    this.walletService.updateWallet(id, wallet).then((result) => {
      if (result) {
        console.log('order edited');
      } else {
        console.log('error in order edition');
      }
    });
  }

  addBalance(value: number) {
    this.accountBalance += value;
    if (this.allWallet[0]?.id) {
      this.editWallet(this.allWallet[0]?.id, this.accountBalance);
    } else {
      this.addWallet(this.accountBalance);
    }
  }

  searchGiftCardByCode(code: string) {
    const foundGiftCard = this.allGifts.find(
      (giftCard: any) => giftCard.code === code
    );
    if (foundGiftCard) {
      return foundGiftCard.price;
    } else {
      return null;
    }
  }
  searchGiftCard(code: string) {
    const foundGiftCard = this.allGifts.find(
      (giftCard: any) => giftCard.code === code
    );
    if (foundGiftCard) {
      return foundGiftCard;
    } else {
      return null;
    }
  }
}
