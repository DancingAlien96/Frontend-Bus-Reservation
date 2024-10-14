import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { LoginInterface } from '../interfaces';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly API_URL = environment.api;
  constructor(private http:HttpClient) { }



  access(login:LoginInterface):Observable<any>{
    return this.http.post<LoginInterface>(`${this.API_URL}/login`, login)
  }
  
 

}
