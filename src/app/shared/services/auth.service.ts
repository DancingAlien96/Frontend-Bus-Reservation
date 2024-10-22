import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authenticated!: boolean;
	validacion: string | null = null;

	constructor(private cookies: CookieService, private router: Router) {}

	isLoggedIn(): boolean {
		const token = sessionStorage.getItem('token');
		return !!token; // Convertimos el valor a booleano
	}

	logOut() {
		return sessionStorage.clear();
	}
}
