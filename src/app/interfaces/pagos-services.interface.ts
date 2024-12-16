import { Estado, Monedas } from "./atributes.enum";
import { TarifaPorConsumoAgua } from "./opciones-confuguraciones.interface";



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
    fechaLimitePago:Date;
    comprobante:ComprobantePago;
    descuentos:DescuentosAplicadosPorPagar[];
    tarifaConsumoCalculo:TarifaPorConsumoAgua;
    created_at:Date;
}
export interface ComprobantePago{
    id:number;
    created_at:Date;
    metodoPago:string;
    montoPagado:string;
    entidadPago:string;
    nroRecibo:string;
    fechaEmitida:Date;
    moneda:string;
}
export interface PagosForm{
    perfilId:number;
    comprobantes:number[];
    multas:[],
}
export interface GestionesPorCobrar{
    gestion:    number;
    comprobantes:   any[];
}

export interface DescuentosAplicadosPorPagar{
    id:number;
    tipoDescuentoBeneficiario:string;
    detalles:string;
    descuento:number;
    comprobante:ComprobantePorPago;
}