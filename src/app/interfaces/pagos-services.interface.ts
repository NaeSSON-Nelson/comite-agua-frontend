import { Estado, Monedas } from "./atributes.enum";
import { MesLectura } from "./medidor.interface";


export interface ComprobantePorPago{
    id:number;
    monto:number;
    moneda:Monedas;
    metodoRegistro:string;
    motivo:string;
    estado:Estado;
    pagado:boolean;
    estadoComprobate:string;
    fechaPagada:Date;
    comprobante:ComprobantePago;
    created_at:Date;
}
export interface ComprobantePago{
    id:number;
    created_at:Date;
    metodoPago:string;
    montoPagado:number;
    entidadPago:string;
    nroRecibo:string;
}
export interface PagosForm{
    titular:string;
    ciTitular:string;
    perfilId:number;
    comprobantes:number[];
}