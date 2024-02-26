import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CartService } from 'src/service/cart.service';
import { RecentsearchService } from 'src/service/recentsearch.service';
import { ApiService } from 'src/service/testapi.service';
import { WishlistService } from 'src/service/wishlist.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  scrolled: boolean = false;
  isCartOpen: boolean = false;
  isSuggested: boolean = false;
  isDropdownOpen: boolean = false;

  position:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'right';
  isMobile: boolean = false;
  isRecent: boolean = false;
  countries?: any[];
  formGroup!: FormGroup;
  filteredCountries: any[] = [];
  totalCartValue: number = 0;
  searchTerm: string = '';
  searchResult: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private recentService: RecentsearchService,
    private router: Router,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  wishlist: any;
  cart: any;
  recent: any;

  ngOnInit() {
    document.addEventListener('click', this.onGlobalClick.bind(this));

    this.formGroup = this.fb.group({
      selectedCountry: new FormControl<object | null>(null),
    });

    this.wishlistService.wishlist$.subscribe((data) => {
      this.wishlist = data;
    });

    this.cartService.cart$.subscribe((data) => {
      this.cart = data;
    });

    this.recentService.recent$.subscribe((data) => {
      this.recent = data;
      if(this.recent.length === 0){
        this.isRecent = false;
      }
    });
  }

  @HostListener('click', ['$event'])
  onDropdownClick(event: Event) {
    event.stopPropagation();
  }

  onGlobalClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      // Click was outside the dropdown, close it
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    const mensApiUrl = `http://localhost:3000/mens?name_like=${this.searchTerm}`;
    const womensApiUrl = `http://localhost:3000/womens?name_like=${this.searchTerm}`;
    if (this.searchTerm !== '') {
      this.isSuggested = true;
      this.isRecent = false;
      forkJoin([
        this.http.get(mensApiUrl),
        this.http.get(womensApiUrl),
      ]).subscribe(([mensProducts, womensProducts]: any) => {
        this.searchResult = [...mensProducts, ...womensProducts];
      });
    } else {
      this.isSuggested = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }
  styleBadge: any = {
    'background-color': '#fff',
    color: '#30568d',
    cursor: 'pointer',
    padding: '20px',
  };
  rightsheetStyle: any = {
    width: '500px',
    height: '100vh',
    maxHeight: '100vh',
    margin: '0',
    // paddingBottom: '80px',
  };

  openCart() {
    this.isCartOpen = true;
  }

  handleClick(type: string, item?: any) {
    if (type === 'overlay') {
      this.isSuggested = false;
      this.isRecent = false;
    } else if (type === 'route') {
      this.recentService.addRecent(item).then((result)=>{
        if(result){
          console.log('Added to recent search');
        }else{
          console.log('Couldnt add to recent search');
        }
      });
      const productUrl = '/products/' + item.category + '/' + item.id;
      this.router.navigate([productUrl]);
      this.isSuggested = false;
      this.isRecent = false;
      this.searchTerm = '';
    }else if(type === 'linkclick'){
      this.isDropdownOpen = false;
    }else if(type === 'sidebarClick'){
      this.isCartOpen = false;
    }
    else if(type === 'recent'){
      this.isRecent = true;
    }else if (type === 'recentdelete') {
      this.recentService.deleteRecent(item.id).then((result) => {
        if (result) {
          console.log('Added to recent search');
        } else {
          console.log('Couldnt add to recent search');
        }
      });
    }
  }
}
