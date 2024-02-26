import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize, mergeMap, timer } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // private totalRequests = 5;

  // constructor(private loadingService: LoaderService) {}

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   console.log('caught');
  //   this.totalRequests++;
  //   this.loadingService.setLoading(true);
  //   return next.handle(request).pipe(
  //     finalize(() => {
  //       this.totalRequests--;
  //       if (this.totalRequests == 0) {
  //         this.loadingService.setLoading(false);
  //       }
  //     })
  //   );
  // }

  private totalRequests = 0;
  private minLoaderDuration = 0; // seconds

  constructor(private loadingService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);

    return timer(this.minLoaderDuration).pipe(
      mergeMap(() => next.handle(request)),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
