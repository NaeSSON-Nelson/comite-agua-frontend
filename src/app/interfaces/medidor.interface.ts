import { Afiliado, Estado } from './afiliado.interface';

export interface Medidor {
  id?: number;
  nroMedidor?: string;
  fechaInstalacion?: Date;
  lecturaInicial?: number;
  ultimaLectura?: number;
  ubicacionBarrio?:  string;
  estado?: Estado;
  marca?: string;
  lecturas?: LecturaMedidor[];
  afiliado?: Afiliado;
}

export interface LecturaMedidor {
  id?: number;
  lectura?: number;
  total?: number;
  estadoMedidor?: string;
  estado?: Estado;
  created_at?: Date;
  updated_at?: Date;
  medidor?: Medidor;
}
