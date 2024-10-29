import { SolicitudBaseInterface } from './solicitudes.interface';

export interface FecvInterface {
	ID_SOLICITUD: number;
	NOMBRE_PILOTO: string;
	CARGO_PILOTO: string;
	COMISION: string;
	TARJETA_CIRCULACION: boolean;
	LLAVES_ENCENDIDO: boolean;
	LLAVES_GASOLINA: boolean;
	LLAVES_LLANTA: boolean;
	ENCENDIDO_MOTOR: boolean;
	RETROVISORES_EXTERIOR: boolean;
	RETROVISORES_INTERIOR: boolean;
	LLANTA_REPUESTO: boolean;
	LLAVE_CHUCHOS: boolean;
	TRICKET: boolean;
	OTROS: string;
	SILVINES: number;
	STOP: number;
	LUZ_RETROCESO: number;
	LUZ_EMERGENCIA: number;
	CONDICIONES_LLANTA: number;
	LIMPIAPARABRISAS: number;
	KILOMETRAJE: number;
	NIVEL_COMBUSTIBLE: number;
	OBSERVACIONES: string;
	FECHA_HORA_ENTREGA: string;
}

export interface FecvPostInterface {
	FECV: FecvInterface;
	SOLICITUD: SolicitudBaseInterface;
}
