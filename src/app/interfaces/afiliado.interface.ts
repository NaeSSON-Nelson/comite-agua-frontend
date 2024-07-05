import { ColumnsAlways } from "./always.interface";
import { Barrio, Estado } from "./atributes.enum";
import { Medidor, MedidorAsociado } from "./medidor.interface";
import { Perfil } from "./perfil.interface";

export interface Afiliado extends ColumnsAlways{
    id?             :number;
    ubicacion?      :Ubicacion;
    medidorAsociado?:MedidorAsociado[];
    perfil?         :Perfil;
}
export interface AfiliadoForm{
    id?             :number;
    estado?         :Estado;
    barrio?          :Barrio
    numeroVivienda?  :string;
    longitud?        :string;
    latitud?         :string;
}

export interface Ubicacion{
    barrio?          :Barrio
    numeroVivienda?  :string;
    longitud?        :any;
    latitud?         :any;
}