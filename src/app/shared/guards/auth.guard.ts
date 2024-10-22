import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
	const token = sessionStorage.getItem('token');
	const router = inject(Router);

	if (!token) {
		router.navigate(['/login']).then(() => {
			window.location.reload(); // Forzar recarga completa de la página
		});
		return false;
	}

	return true;
};
