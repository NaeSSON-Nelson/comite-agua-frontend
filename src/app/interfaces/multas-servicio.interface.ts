import { Monedas } from "./atributes.enum";
import { MedidorAsociado, PlanillaMesLectura } from "./medidor.interface";

export interface MultaServicio{
    id:number;
    motivo:string;
    monto:string;
    moneda:Monedas;
    pagado:boolean;
    lecturasMultadas: PlanillaMesLectura[];
    medidorAsociado:MedidorAsociado;
    comprobante:ComprobanteDePagoDeMultas;
    multaColor?:string;
    created_at: Date;
}


export interface ComprobanteDePagoDeMultas{
    id:number;
    fechaEmitida:Date;
    metodoPago:string;
    montoPagado:string;
    moneda:Monedas;
    entidadPago?:string;
    nroRecibo?:string;
    multaServicio:MultaServicio;
    created_at: Date;
    // updated_at: Date;
}