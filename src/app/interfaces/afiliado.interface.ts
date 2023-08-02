import { Barrio, Estado } from "./atributes.enum";
import { Medidor } from "./medidor.interface";

export interface Afiliado {
    id?             :number;
    isActive?       :boolean;
    ubicacion?      :Ubicacion;
    medidores?      :Medidor[];
    estado?         :Estado;
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
    longitud?        :string;
    latitud?         :string;
}