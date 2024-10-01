import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated!:boolean;
  validacion:string | null = null;


  constructor(private cookies:CookieService) {


   }
  

   
   isLoggedIn(): boolean {
    // Verificamos si el token existe en las cookies
    return this.cookies.check('token');
  }

  logOut(){
    return this.cookies.deleteAll();
  }


  }
