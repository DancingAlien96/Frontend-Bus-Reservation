export interface VehiculoInterface {
	ID_VEHICULO: number;
	PLACA: string;
	TIPO: string;
	MARCA: string;
	COLOR: string;
	ESTADO: number;
	REGISTRO_DE_INVENTARIO: string;
	KILOMETRAJE: number;
	NIVEL_DE_COMBUSTIBLE: number;
	BITACORA_CONDICIONES: BitacoraCondicionesInterface;
}

export interface BitacoraCondicionesInterface {
	ID_BITACORA: number;
	FECHA_HORA_BITACORA: Date;
	ID_VEHICULO: number;
	ID_FECV: number | null;
	ID_FDCV: number | null;
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
	OBSERVACIONES: null;
}

export interface BitacoraCondicionesPostInterface {
	FECHA_HORA_BITACORA: Date;
	ID_VEHICULO: number;
	ID_FECV: number | null;
	ID_FDCV: number | null;
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
	OBSERVACIONES: null;
}
