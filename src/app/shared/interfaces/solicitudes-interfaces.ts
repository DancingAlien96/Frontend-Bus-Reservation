export interface SolicitudesInterfaces {
    ID_SOLICITUD:          number;
    ID_USUARIO:            number;
    ID_VEHICULO:           number;
    DESTINO:               string;
    DILIGENCIA:            string;
    FECHA_CREACION:        Date;
    FECHA_HORA_ENTREGA:    Date;
    FECHA_HORA_DEVOLUCION: Date;
    CON_PILOTO:            boolean;
    NOMBRE_PILOTO:         string;
    ESTADO:                number;
    MODIFICABLE:           boolean;
    MOTIVO_RECHAZO:        string;
    ENTREGADO:             boolean;
    DEVUELTO:              boolean;
    VEHICULO:              VehiculoInterface;
    USUARIO:               UsuarioInterface;
    FECV:                  FdcvInterface | null;
    FDCV:                  FdcvInterface | null;
}

export interface FdcvInterface {
    ID_SOLICITUD:          number;
    TARJETA_CIRCULACION:   boolean;
    LLAVES_ENCENDIDO:      boolean;
    LLAVES_GASOLINA:       boolean;
    LLAVES_LLANTA:         boolean;
    ENCENDIDO_MOTOR:       boolean;
    RETROVISORES_EXTERIOR: boolean;
    RETROVISORES_INTERIOR: boolean;
    LLANTA_REPUESTO:       boolean;
    LLAVE_CHUCHOS:         boolean;
    TRICKET:               boolean;
    OTROS:                 string;
    SILVINES_STOP:         number;
    LUZ_RETROCESO:         number;
    LUZ_EMERGENCIA:        number;
    CONDICIONES_LLANTA:    number;
    LIMPIAPARABRISAS:      number;
    KILOMETRAJE:           number;
    NIVEL_COMBUSTIBLE:     number;
    FACTURA_SERIE:         string;
    NO_FACTURA:            string;
    GALONES:               number;
    PRECIO:                number;
    TOTAL:                 number;
    FECHA_LLENADO:         Date;
    OBSERVACIONES:         string;
    FECHA_HORA_ENTREGA:    Date;
}

export interface UsuarioInterface {
    ID_USUARIO:        number;
    USERNAME:          string;
    PASSWORD:          string;
    CORREO:            string;
    NOMBRE_COMPLETO:   string;
    CUI:               number;
    REGISTRO_PERSONAL: number;
    FECHA_NACIMIENTO:  Date;
    TELEFONO_UNO:      string;
    TELEFONO_DOS:      string;
    ROL:               RolInterface;
}

export interface RolInterface {
    ID_ROL: number;
    NOMBRE: string;
}

export interface VehiculoInterface {
    ID_VEHICULO:            number;
    PLACA:                  string;
    TIPO:                   string;
    MARCA:                  string;
    COLOR:                  string;
    REGISTRO_DE_INVENTARIO: string;
    KILOMETRAJE:            number;
    NIVEL_DE_COMBUSTIBLE:   number;
}


