import { Observable, merge } from 'rxjs';
import { ApiService } from '../service/testapi.service';

export const getAllProductsApi = (
  category: string,
  apiService: ApiService,
  page:number
): Observable<any> => {
  if (category === 'mens') {
    return apiService.getMensProduct(page);
  } else if (category === 'womens') {
    return apiService.getWomensProduct(page);
  }
  return new Observable();
};

export const getFullProductsApi = (
  category: string,
  apiService: ApiService,
): Observable<any> => {
  if (category === 'mens') {
    return apiService.getMensProduct();
  } else if (category === 'womens') {
    return apiService.getWomensProduct();
  }
  return new Observable();
};

export const updateCart = (
  apiService: ApiService,
  id: string,
  updatedData: any,
): Observable<any> => {
  return apiService.updateCart(id, updatedData);
};

export const getFilteredProducts = (
  apiService: ApiService,
  category:string,
  params: any,
): Observable<any> => {
  return apiService.filterProducts(category, params);
};

export const updateProduct = (
  category: string,
  apiService: ApiService,
  id:string,
  updatedData: any
): Observable<any> => {
  if (category === 'mens') {
    return apiService.updateMensProduct(id, updatedData);
  }else if(category === 'womens'){
    return apiService.updateWomensProduct(id, updatedData);
  }
  return new Observable();
};

export const sortPriceApi = (
  order: string,
  category: string,
  apiService: ApiService,
  page:number
): Observable<any> => {
  if (category === 'mens') {
    return apiService.getMensProduct(page, 'price', order);
  } else if (category === 'womens') {
    return apiService.getWomensProduct(page, 'price', order);
  }
  return new Observable();
};

export const sortRatingApi = (
  order: string,
  category: string,
  apiService: ApiService,
  page:number
): Observable<any> => {
  if (category === 'mens') {
    return apiService.getMensProduct(page, 'rating', order);
  } else if (category === 'womens') {
    return apiService.getWomensProduct(page, 'rating', order);
  }
  return new Observable();
};
