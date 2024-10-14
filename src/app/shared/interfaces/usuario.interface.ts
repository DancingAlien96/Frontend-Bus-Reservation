export interface UsuarioInterface {
	ID_USUARIO: number;
	USERNAME: string;
	CORREO: string;
	NOMBRE_COMPLETO: string;
	CUI: number;
	REGISTRO_PERSONAL: number;
	FECHA_NACIMIENTO: Date;
	TELEFONO_UNO: string;
	TELEFONO_DOS: string;
	ID_ROL:number;
	ROL: RolInterface;
}

export interface UsuarioNoRolInterface {
	ID_USUARIO: number;
	USERNAME: string;
	CORREO: string;
	NOMBRE_COMPLETO: string;
	CUI: number;
	REGISTRO_PERSONAL: number;
	FECHA_NACIMIENTO: Date | string;
	TELEFONO_UNO: string | null;
	TELEFONO_DOS: string | null;
}

export interface RolInterface {
	ID_ROL: number;
	NOMBRE: string;
}
