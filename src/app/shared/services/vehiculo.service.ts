import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import {
	BitacoraCondicionesPostInterface,
	VehiculoInterface,
	VehiculoPostInterface
} from '../interfaces/vehiculo.interface';

@Injectable({
	providedIn: 'root'
})
export class VehiculoService {
	postVehiculo(vehiculo: VehiculoPostInterface) {
		return this.http.post(`${this.url}/vehiculo`, vehiculo);
	}
	readonly url = environment.api;
	private updateSubject = new Subject<void>();
	getUpdateObservable(): Observable<void> {
		return this.updateSubject.asObservable();
	}
	emitUpdate() {
		this.updateSubject.next();
	}

	constructor(private http: HttpClient) {}

	getVehiculos(): Observable<VehiculoInterface[]> {
		return this.http.get<VehiculoInterface[]>(`${this.url}/vehiculo`);
	}

	getVehiculo(idVehiculo: number): Observable<VehiculoInterface> {
		return this.http.get<VehiculoInterface>(`${this.url}/vehiculo/${idVehiculo}`);
	}

	updateBitacoraCondiciones(condiciones: BitacoraCondicionesPostInterface) {
		return this.http.post(`${this.url}/condiciones`, condiciones);
	}

	patchActivarDesactivarVehiculo(ID_VEHICULO: number) {
		return this.http.patch(`${this.url}/vehiculo/activate/${ID_VEHICULO}`, {});
	}
}
