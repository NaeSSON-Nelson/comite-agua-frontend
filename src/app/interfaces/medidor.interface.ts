import { Afiliado } from "./afiliado.interface";
import { ColumnsAlways } from "./always.interface";


export interface Medidor extends ColumnsAlways{
  id?: number;
  nroMedidor?: string;
  fechaInstalacion?: Date;
  lecturaInicial?: number;
  ultimaLectura?: number;
  ubicacionBarrio?:  string;
  marca?: string;
  lecturas?: LecturaMedidor[];
  afiliado?: Afiliado;
}

export interface LecturaMedidor extends ColumnsAlways{
  id?: number;
  lectura?: number;
  total?: number;
  estadoMedidor?: string;
  medidor?: Medidor;
}
