import { Component } from '@angular/core';
import { WishlistService } from 'src/service/wishlist.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  wishlistData: any;
  constructor(
    public wishlistService: WishlistService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.wishlistService.wishlist$.subscribe((data: any) => {
      this.wishlistData = data;
      this.cdRef.detectChanges();
    });
    console.log('wishlist loaded')
  }

  handleClick() {
    console.log(this.wishlistData);
  }
}
