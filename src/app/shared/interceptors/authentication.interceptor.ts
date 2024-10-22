import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../enviroment/environment.prod';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
	const token = sessionStorage.getItem('token');

	// Siempre establecemos 'Content-Type' como 'application/json'
	let headers = new HttpHeaders({
		'Content-Type': 'application/json'
	});

	// Si hay un token en sessionStorage, añadimos el header 'Authorization'
	if (token) {
		headers = headers.set('Authorization', 'Bearer ' + token);
	}

	// Clonamos la solicitud con los nuevos headers
	req = req.clone({ headers });

	return next(req);
};
