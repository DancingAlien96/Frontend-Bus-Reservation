import { FdcvInterface } from './fdcv.interface';
import { FecvInterface } from './fecv.interface';
import { UsuarioNoRolInterface, UsuarioInterface } from './usuario.interface';
import { VehiculoInterface } from './vehiculo.interface';

export interface SolicitudesInterfaces {
	ID_SOLICITUD: number;
	ID_USUARIO: number;
	ID_VEHICULO: number;
	NOMBRE_SOLICITANTE: string;
	DESTINO: string;
	DILIGENCIA: string;
	FECHA_CREACION: string;
	FECHA_HORA_ENTREGA: string;
	FECHA_HORA_DEVOLUCION: string;
	CON_PILOTO: boolean;
	NOMBRE_PILOTO: string;
	ESTADO: number;
	MODIFICABLE: boolean;
	MOTIVO_RECHAZO: string;
	ENTREGADO: boolean;
	DEVUELTO: boolean;
	VEHICULO: VehiculoInterface;
	USUARIO: UsuarioInterface;
	FECV: FecvInterface | null;
	FDCV: FdcvInterface | null;
}

export interface SolicitudPostInterface {
	SOLICITUD: {
		ID_USUARIO: number;
		ID_VEHICULO: number;
		NOMBRE_SOLICITANTE: string;
		DESTINO: string;
		DILIGENCIA: string;
		FECHA_CREACION: string;
		FECHA_HORA_ENTREGA: string;
		FECHA_HORA_DEVOLUCION: string;
		CON_PILOTO: boolean;
		NOMBRE_PILOTO: string | null;
		ESTADO: number;
		MODIFICABLE: boolean;
		MOTIVO_RECHAZO: string;
		ENTREGADO: boolean;
		DEVUELTO: boolean;
	};
	VEHICULO: VehiculoInterface;
	USUARIO: UsuarioNoRolInterface;
}

export interface SolicitudBaseInterface {
	ID_SOLICITUD: number;
	ID_USUARIO: number;
	ID_VEHICULO: number;
	NOMBRE_SOLICITANTE: string;
	DESTINO: string;
	DILIGENCIA: string;
	FECHA_CREACION: string;
	FECHA_HORA_ENTREGA: string;
	FECHA_HORA_DEVOLUCION: string;
	CON_PILOTO: boolean;
	NOMBRE_PILOTO: string;
	ESTADO: number;
	MODIFICABLE: boolean;
	MOTIVO_RECHAZO: string;
	ENTREGADO: boolean;
	DEVUELTO: boolean;
}
