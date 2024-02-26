import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthGuardService } from 'src/service/auth-guard.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isCheckout:boolean = false;
  constructor(private authService: AuthGuardService, private router: Router) {
    this.authService.auth$.subscribe((data) => {
      this.isCheckout = data;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.isCheckout = this.authService.getCheckoutStatus();

    if (this.isCheckout) {
      return true;
    } else {
      this.router.navigate(['/cart']);
      return false;
    }
  }
}
