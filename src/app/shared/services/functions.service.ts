import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FunctionsService {
	constructor() {}

	combinarFechaHora(fecha: Date, hora: string): Date {
		const fechaConHora = new Date(fecha);
		fechaConHora.setHours(parseInt(hora.split(':')[0]));
		fechaConHora.setMinutes(parseInt(hora.split(':')[1]));
		fechaConHora.setSeconds(0);
		fechaConHora.setMilliseconds(0);

		return fechaConHora;
	}
}
