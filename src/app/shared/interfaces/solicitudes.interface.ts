import { UsuarioNoRolInterface, UsuarioInterface } from './usuario.interface';
import { VehiculoInterface } from './vehiculo.interface';

export interface SolicitudesInterfaces {
	ID_SOLICITUD: number;
	ID_USUARIO: number;
	ID_VEHICULO: number;
	DESTINO: string;
	DILIGENCIA: string;
	FECHA_CREACION: Date;
	FECHA_HORA_ENTREGA: Date;
	FECHA_HORA_DEVOLUCION: Date;
	CON_PILOTO: boolean;
	NOMBRE_PILOTO: string;
	ESTADO: number;
	MODIFICABLE: boolean;
	MOTIVO_RECHAZO: string;
	ENTREGADO: boolean;
	DEVUELTO: boolean;
	VEHICULO: VehiculoInterface;
	USUARIO: UsuarioInterface;
	FECV: FdcvInterface | null;
	FDCV: FdcvInterface | null;
}

export interface SolicitudPostInterface {
	SOLICITUD: {
		ID_USUARIO: number;
		ID_VEHICULO: number;
		DESTINO: string;
		DILIGENCIA: string;
		FECHA_CREACION: Date;
		FECHA_HORA_ENTREGA: Date;
		FECHA_HORA_DEVOLUCION: Date;
		CON_PILOTO: boolean;
		NOMBRE_PILOTO: string;
		ESTADO: number;
		MODIFICABLE: boolean;
		MOTIVO_RECHAZO: string | null;
		ENTREGADO: boolean;
		DEVUELTO: boolean;
	};
	VEHICULO: VehiculoInterface;
	USUARIO: UsuarioNoRolInterface;
}

export interface FdcvInterface {
	ID_SOLICITUD: number;
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
	SILVINES_STOP: number;
	LUZ_RETROCESO: number;
	LUZ_EMERGENCIA: number;
	CONDICIONES_LLANTA: number;
	LIMPIAPARABRISAS: number;
	KILOMETRAJE: number;
	NIVEL_COMBUSTIBLE: number;
	FACTURA_SERIE: string;
	NO_FACTURA: string;
	GALONES: number;
	PRECIO: number;
	TOTAL: number;
	FECHA_LLENADO: Date;
	OBSERVACIONES: string;
	FECHA_HORA_ENTREGA: Date;
}
