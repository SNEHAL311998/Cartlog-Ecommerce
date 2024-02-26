import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/service/testapi.service';
import {
  getAllProductsApi,
  getFilteredProducts,
  getFullProductsApi,
  sortPriceApi,
  sortRatingApi,
} from 'src/utils/apiService';


@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent {
  category: any;
  _sort: any;
  _order: any;
  rangeValues: number[] = [0, 0];
  layout: string = localStorage.getItem('gridlayout') || 'list';
  sort: number = 0;
  products: any[] = [];
  fullProducts: any[] = [];
  page: number = 1;
  ratingSelectStates: { [key: string]: boolean } = {};
  sizeCheckboxStates: { [key: string]: boolean } = {};
  selectedRating: number;
  isCleared: boolean = false;
  isPriceChanged: boolean = false;
  isFilter: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {
    this.products;
    this.selectedRating = 0;
    for (const size of this.allFilters.size) {
      this.sizeCheckboxStates[size] = false;
    }
    for (const rating of this.allFilters.rating) {
      this.ratingSelectStates[rating] = false;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (localStorage.getItem('gridlayout') === null) {
      localStorage.setItem('gridlayout', 'list');
    }
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
    });

    this.route.queryParamMap.subscribe((queryParams) => {
      this._sort = queryParams.get('_sort');
      this._order = queryParams.get('_order');
      if (this._sort || this._order) {
        this._sort === 'price' && this.sortPrice(this._order);
        this._sort === 'rating' && this.sortRating(this._order);
      } else {
        this.getAllProducts();
      }
    });
  }

  position:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'left';

  rightsheetStyle: any = {
    width: '500px',
    height: '100vh',
    maxHeight: '100vh',
    margin: '0',
    // paddingBottom: '80px',
  };

  filterContent: {
    size: string[];
    rating: any;
  } = {
    size: ['S', 'M', 'L', 'XL'],
    rating: ['4', '3', '2'],
  };

  allFilters: any = {
    price: this.calculateMinMaxPrices(this.fullProducts),
    size: [],
    rating: [],
  };

  updateFilters(type: string, item: any) {
    if (this.allFilters[type].includes(item)) {
      this.allFilters[type] = this.allFilters[type].filter(
        (value: any) => value !== item
      );
    } else {
      if (type === 'rating') {
        this.allFilters[type] = [item];
      } else if (type === 'price') {
        this.isPriceChanged = true;
        this.allFilters.price = this.rangeValues;
      } else {
        this.allFilters[type].push(item);
      }
    }
    this.getFilterProducts();
  }

  handleLayout(grid: string) {
    localStorage.setItem('gridlayout', grid);
    this.layout = grid;
  }

  clearFilters(type: string) {
    if (type === 'all') {
      this.allFilters = {
        price: [],
        size: [],
        rating: [],
      };
      this.isPriceChanged = false;
      this.sizeCheckboxStates = {};
      this.ratingSelectStates = {};
      this.isCleared = true;
    } else if (type === 'size') {
      this.allFilters.size = [];
      this.sizeCheckboxStates = {};
    } else if (type === 'rating') {
      this.allFilters.rating = [];
      this.ratingSelectStates = {};
    }
    this.getFilterProducts();
  }

  getAllProducts() {
    getAllProductsApi(this.category, this.apiService, this.page).subscribe(
      (data) => {
        this.products = [...this.products, ...data];
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    getFullProductsApi(this.category, this.apiService).subscribe(
      (data) => {
        this.fullProducts = data;
        this.rangeValues = this.calculateMinMaxPrices(this.fullProducts);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  getAfterClear(){
    getAllProductsApi(this.category, this.apiService, this.page).subscribe(
      (data) => {
        this.products = data;
        this.rangeValues = this.calculateMinMaxPrices(this.fullProducts);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.isCleared = false;
  }

  getFilterProducts() {
    let params = new HttpParams()
      .set('rating_gte', this.allFilters.rating)
      .set('size_in', this.allFilters.size)
      .set('price_gte', this.rangeValues[0])
      .set('price_lte', this.rangeValues[1]);
    if (!this.isCleared) {
      getFilteredProducts(this.apiService, this.category, params).subscribe(
        (data) => {
          this.products = data;
        },
        (error) => {
          console.log('Error', error);
        }
      );
    } else {
      // this.getAllProducts();
      this.getAfterClear();
    }
  }

  calculateMinMaxPrices(products: any) {
    if (products && products.length > 0) {
      const prices = products.map((product: any) => product.price);
      const minValue = Math.min(...prices);
      const maxValue = Math.max(...prices);
      return [minValue, maxValue];
    }
    return [0, 0];
  }

  loadMoreProducts(): void {
    this.allFilters = {
      price: [],
      size: [],
      rating: [],
    };
    this.isPriceChanged = false;
    this.page++;
    this.getAllProducts();
  }

  sortPrice(order: string) {
    this.router
      .navigate(['/products', this.category], {
        queryParams: { _sort: 'price', _order: order },
      })
      .then(() => {
        sortPriceApi(
          this._order,
          this.category,
          this.apiService,
          this.page
        ).subscribe(
          (data) => {
            this.products = data;
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }

  sortRating(order: string) {
    this.router
      .navigate(['/products', this.category], {
        queryParams: { _sort: 'rating', _order: order },
      })
      .then(() => {
        sortRatingApi(
          this._order,
          this.category,
          this.apiService,
          this.page
        ).subscribe(
          (data) => {
            this.products = data;
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }

  handleSort(grid: number, type: string) {
    this.sort = grid;
    if (type === 'plow') {
      this.sortPrice('asc');
    } else if (type === 'phigh') {
      this.sortPrice('desc');
    } else if (type === 'rlow') {
      this.sortRating('asc');
    } else if (type === 'rhigh') {
      this.sortRating('desc');
    } else return;
  }

  handleFilter(){
    this.isFilter = true;
  }
}
