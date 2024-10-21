import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
	const token = sessionStorage.getItem('token');
	if (!token) {
		const router = inject(Router);
		router.navigateByUrl('');
		return false;
	}
	return true;
};
