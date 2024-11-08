import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authLoginGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const token = localStorage.getItem('token');
	if (token) {
		// Si el token existe, redirigir a 'home'
		router.navigate(['/home']).then(() => {
			window.location.reload(); // Forzar recarga completa de la página
		});
		return false; // Impedir acceso a la ruta de login
	}
	return true; // Permitir acceso si no hay token
};
