import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import { VehiculoInterface } from '../interfaces/vehiculo.interface';

@Injectable({
	providedIn: 'root'
})
export class VehiculoService {
	readonly url = environment.api;

	constructor(private http: HttpClient) {}

	getVehiculos(): Observable<VehiculoInterface[]> {
		return this.http.get<VehiculoInterface[]>(`${this.url}/vehiculo`);
	}


	getVehiculo(idVehiculo:number):Observable<VehiculoInterface>{
		return this.http.get<VehiculoInterface>(`${this.url}/vehiculo/${idVehiculo}`)
	}

}
