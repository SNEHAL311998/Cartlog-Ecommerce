import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './containers/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselComponent } from './containers/hero/carousel.component';
import { CarouselModule } from '@coreui/angular';
import { CategoryComponent } from './containers/category/category.component';
import { FeaturedComponent } from './containers/featured/featured.component';
import { LatestComponent } from './containers/latest/latest.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { TopbrandsComponent } from './containers/topbrands/topbrands.component';
import { FooterComponent } from './containers/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { StarRatingModule } from 'angular-star-rating';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductlistComponent } from './pages/productlist/productlist.component';
import { SliderModule } from 'primeng/slider';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CheckboxModule } from 'primeng/checkbox';
import { WishlistService } from 'src/service/wishlist.service';
import { CommonService } from 'src/service/common.service';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/order/order.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AccordionModule } from 'primeng/accordion';
import { OrderplacedComponent } from './pages/orderplaced/orderplaced.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { GiftcardComponent } from './pages/giftcard/giftcard.component';
import { TabViewModule } from 'primeng/tabview';
import { DatePipe } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { WalletComponent } from './pages/wallet/wallet.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingInterceptor } from 'src/service/loading.interceptor';
import { OrderlistComponent } from './pages/orderlist/orderlist.component';
import { AddressComponent } from './pages/address/address.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';

// Export this function
export function playerFactory(): any {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CarouselComponent,
    CategoryComponent,
    FeaturedComponent,
    LatestComponent,
    ProductGridComponent,
    TopbrandsComponent,
    FooterComponent,
    HomeComponent,
    NotfoundComponent,
    SingleProductComponent,
    ProductlistComponent,
    BreadcrumbComponent,
    WishlistComponent,
    CartComponent,
    OrderComponent,
    CheckoutComponent,
    OrderplacedComponent,
    ListViewComponent,
    GiftcardComponent,
    WalletComponent,
    LoaderComponent,
    OrderlistComponent,
    AddressComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    DialogModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    CarouselModule,
    HttpClientModule,
    StarRatingModule.forRoot(),
    ToastModule,
    SliderModule,
    CheckboxModule,
    InfiniteScrollModule,
    AccordionModule,
    TabViewModule,
    ClipboardModule,
    LottieModule.forRoot({ player: playerFactory }),
    ShareButtonsModule,
    ShareIconsModule,
    TableModule,
    TagModule,
    SidebarModule
  ],
  providers: [
    MessageService,
    WishlistService,
    CommonService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

