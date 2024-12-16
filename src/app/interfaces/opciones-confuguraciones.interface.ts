import { ColumnsAlways } from "./always.interface";
import { Monedas, TipoMulta } from "./atributes.enum";
import { MultaServicio } from "./multas-servicio.interface";
import { ComprobantePorPago } from "./pagos-services.interface";

export interface TarifaPorConsumoAgua extends ColumnsAlways{

    id:number;
    tarifaMinima:number;
    lecturaMinima:number;
    tarifaAdicional:number;
    diaLimitePago:number;
    moneda:Monedas;
    vigencia:Date;

    comprobantesLecturas:ComprobantePorPago[];
}

export interface TarifaMultaPorRetrasosPagos extends ColumnsAlways{

    id:number;
    monto:number;
    moneda:Monedas;
    mesesDemora:number;
    vigencia:Date;
    tipoMulta:TipoMulta;
    multasRetrasos:MultaServicio[]
}

export interface BeneficiarioDescuentos extends ColumnsAlways{
    id:number;
    tipoBeneficiario:string;
    detalles:string;
    descuento:number;
}