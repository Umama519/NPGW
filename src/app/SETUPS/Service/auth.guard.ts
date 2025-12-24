import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const router = inject(Router);
  const loggedUser = localStorage.getItem('loginUser');

  if (state.url.includes('app-cares-error')) {
    return true;
  }

  if (!loggedUser || loggedUser.trim() === '') {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
  
  return true;
};
