import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import { SolicitudesInterfaces, SolicitudPostInterface } from '../interfaces/solicitudes.interface';

@Injectable({
	providedIn: 'root'
})
export class SolicitudesService {
	readonly url = environment.api;
	constructor(private http: HttpClient) {}

	getSolicitudes(): Observable<SolicitudesInterfaces[]> {
		return this.http.get<SolicitudesInterfaces[]>(`${this.url}/solicitud`);
	}

	postSolicitud(solicitud: SolicitudPostInterface): Observable<SolicitudPostInterface> {
		return this.http.post<SolicitudPostInterface>(`${this.url}/solicitud`, solicitud);
	}


  solicitudFiltrada(id:number):Observable<any>{
	return this.http.get(`${this.url}/solicitud/filter?user=${id}`);
  }
}
