import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudesInterfaces } from '../interfaces/solicitudes-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
 readonly url = "http://localhost:5000/api/v1/solicitud";
  constructor(private http:HttpClient) {


   }

   
   getSolicitudes(): Observable<SolicitudesInterfaces[]>{
    return this.http.get<SolicitudesInterfaces[]>(this.url);
    }
}
