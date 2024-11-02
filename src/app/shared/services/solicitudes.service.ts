import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import { SolicitudesInterfaces, SolicitudPostInterface } from '../interfaces/solicitudes.interface';
import { VehiculoInterface } from '../interfaces';
import { UsuarioInterface } from '../interfaces/usuario.interface';

@Injectable({
	providedIn: 'root'
})
export class SolicitudesService {
	readonly url = environment.api;
	constructor(private http: HttpClient) {}

	getSolicitudes(): Observable<SolicitudesInterfaces[]> {
		return this.http.get<SolicitudesInterfaces[]>(`${this.url}/solicitud`); //{withCredentials: true}
	}

	postSolicitud(solicitud: SolicitudPostInterface): Observable<SolicitudPostInterface> {
		return this.http.post<SolicitudPostInterface>(`${this.url}/solicitud`, solicitud);
	}

	getSolicitudesByDateAndVehicle(
		inicio: string | null,
		fin: string | null,
		vehiculo: VehiculoInterface | undefined
	): Observable<SolicitudesInterfaces[]> {
		return this.http.get<SolicitudesInterfaces[]>(
			`${this.url}/solicitud/filter/fechas?inicio=${inicio}&fin=${fin}&vehiculo=${vehiculo?.ID_VEHICULO}`
		);
	}

	solicitudFiltrada(id: number): Observable<any> {
		return this.http.get(`${this.url}/solicitud/filter?user=${id}`);
	}


	actualizarEstado(id:number, estado:number, motivo:string):Observable<UsuarioInterface>{
		const actual = { id, estado, motivo };
		return this.http.patch<UsuarioInterface>(`${this.url}/solicitud`,actual);
	}



}
