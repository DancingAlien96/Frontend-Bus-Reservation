import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  readonly url = environment.api;
  constructor(private http:HttpClient) {

   }


   getUsuarios():Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(`${this.url}/usuario`);
   }
}
