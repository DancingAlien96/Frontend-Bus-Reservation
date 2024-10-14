import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const cookies = inject(CookieService);
  const token = cookies.get('token');
  if(token){
  const router = inject(Router);
  router.navigateByUrl((''));
  return true;
  }
  return false;
};
