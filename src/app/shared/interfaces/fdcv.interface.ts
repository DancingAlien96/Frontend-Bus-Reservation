import { SolicitudBaseInterface } from './solicitudes.interface';

export interface FdcvInterface {
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
	FACTURA_SERIE: string | null;
	NO_FACTURA: string | null;
	GALONES: number | null;
	PRECIO: number | null;
	TOTAL: number | null;
	FECHA_LLENADO: string | null;
	OBSERVACIONES_DEVOLUCION: string | null;
	FECHA_HORA_ENTREGA: string;
	FECHA_HORA_DEVOLUCION: string;
	KILOMETRAJE_FINAL: number;
	NIVEL_COMBUSTIBLE_FINAL: number;
	KILOMETROS_RECORRIDOS: number;
	FALLA_O_INCIDENCIA: string | null;
	NOMBRE_RECEPTOR: string;
}

export interface FdcvPostInterface {
	FDCV: FdcvInterface;
	SOLICITUD: SolicitudBaseInterface;
}
