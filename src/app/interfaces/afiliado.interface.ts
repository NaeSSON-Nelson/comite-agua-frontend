import { ColumnsAlways } from "./always.interface";
import { Barrio, Estado, MetodoPago, Monedas } from "./atributes.enum";
import { Medidor, MedidorAsociado } from "./medidor.interface";
import { Perfil } from "./perfil.interface";

export interface Afiliado extends ColumnsAlways{
    id?                 :number;
    ubicacion?          :Ubicacion;
    metodoPago?         :MetodoPago;
    entidad?            :string;
    nroRecibo?          :string;
    remitente?          :string;
    montoRecibido?      :number;
    monedaRecibido?     :Monedas;
    medidorAsociado?    :MedidorAsociado[];
    perfil?             :Perfil;
    monto?              :number;
    moneda?             :Monedas;
    fechaPago?          :Date;
    pagado?             :boolean;
    nroCuenta?          :string;

}
export interface AfiliadoForm{
    id?              :number;
    estado?          :Estado;
    monto?           :number;
    moneda?          :Monedas;
    //ubicacion
    barrio?          :Barrio
    numeroVivienda?  :string;
    longitud?        :string;
    latitud?         :string;
    manzano?         :string;
    numeroManzano?   :number;
    nroLote?         :number;
}

export interface Ubicacion{
    barrio?          :Barrio
    numeroVivienda?  :string;
    numeroManzano?   :number;
    nroLote?         :number;
    manzano?         :string;
    longitud?        :any;
    latitud?         :any;
}