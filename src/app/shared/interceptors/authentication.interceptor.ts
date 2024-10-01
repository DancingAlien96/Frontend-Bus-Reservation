import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../enviroment/environment.prod';
import { CookieService } from 'ngx-cookie-service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('headerInterceptor');
  
   //este intercepetor no es necesario ya sea por que se esta utilizando cookies

	let headers = new HttpHeaders({});
	const url = environment.api;
	if (req.url.includes(`${url}/api/users`)) {
		headers = headers.set('Content-Type', 'application/json');
		headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
		req = req.clone({ headers });
	}

	return next(req);
};
