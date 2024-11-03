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
	ACTIVO: boolean;
	DEFAULT_PASSWORD: boolean;
	ID_ROL: number;
	ROL: RolInterface;
}

export interface UsuarioNoRolInterface {
	ID_USUARIO: number;
	USERNAME: string;
	CORREO: string;
	NOMBRE_COMPLETO: string;
	CUI: number;
	REGISTRO_PERSONAL: number;
	FECHA_NACIMIENTO: Date;
	TELEFONO_UNO: string;
	TELEFONO_DOS: string;
	ACTIVO: boolean;
	DEFAULT_PASSWORD: boolean;
	ID_ROL: number;
}

export interface RolInterface {
	ID_ROL: number;
	NOMBRE: string;
}

export interface UsuarioNewPasswordInterface {
	ID_USUARIO: number;
	USERNAME: string;
	NEW_PASSWORD: string;
}

export interface UsuarioPostInterface {
	USERNAME: string;
	CORREO: string;
	NOMBRE_COMPLETO: string;
	CUI: number;
	REGISTRO_PERSONAL: number;
	FECHA_NACIMIENTO: string;
	TELEFONO_UNO: string;
	TELEFONO_DOS: string | null;
	ID_ROL: number;
}
