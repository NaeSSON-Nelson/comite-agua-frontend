import { Medidor } from "./medidor.interface";

export interface Afiliado {
    id?:                number;
    nombrePrimero?:     string;
    nombreSegundo?:     string;
    apellidoPrimero?:   string;
    apellidoSegundo?:   string;
    CI?:                string;
    genero?:            string;
    profesion?:         string;
    barrio?:            string;
    fechaNacimiento?:   Date;
    estado?:            Estado;
    medidores?:         Medidor[];
}

export enum Estado{

    ACTIVO=1,
    INACTIVO=0,
    SUSPENDIDO=2,
    
}