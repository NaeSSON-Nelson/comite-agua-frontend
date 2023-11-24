import { Afiliado, Ubicacion } from "./afiliado.interface";
import { ColumnsAlways } from "./always.interface";
import { Barrio, Estado } from "./atributes.enum";
import { ComprobantePorPago } from "./pagos-services.interface";


export interface Medidor{
  id?:                number;
  nroMedidor?:        string;
  fechaInstalacion?:  Date;
  lecturaInicial?:    number;
  ultimaLectura?:     number;
  ubicacion?:         Ubicacion;
  marca?:             string;
  afiliado?:          Afiliado;
  planillas?:         PlanillaLecturas[];
  created_at?:        Date;
  updated_at?:        Date;
  isActive?:          boolean;
  estado?:            Estado;
}
export interface MedidorForm{
  id?:                number;
  nroMedidor?:        string;
  fechaInstalacion?:  Date;
  lecturaInicial?:    number;
  marca?:             string;
  afiliado?:          Afiliado;
  barrio?:            Barrio
  numeroVivienda?:    string;
  longitud?:          string;
  latitud?:           string;
  estado?:            Estado;
}
export interface PlanillaLecturas{
  id?:  number;
  gestion: number;
  lecturas: MesLectura[];
}
export interface MesLectura extends ColumnsAlways{
  id?: number;
  lectura?: number;
  consumoTotal?: number;
  estadoMedidor?: string;
  mesLecturado?:string;
  pagar?:ComprobantePorPago;
}
export interface AnioSeguimientoLecturas extends ColumnsAlways{
  id?:number;
  anio?:number;
  meses?:MesSeguimientoRegistroLectura[];
}
export interface MesSeguimientoRegistroLectura extends ColumnsAlways{
  id?:number;
  mes:string;
  fechaRegistroLectura:Date;
  fechaFinRegistroLectura:Date;
}
export interface LecturasOptions{
  mes?:string|null;
  gestion?:number|null;
  barrio?:Barrio | null;
}
export interface PlanillaForm{
  id:number;
}
export interface lecturasForm{
  lectura:number;
  estadoMedidor?:string;
  planilla:PlanillaForm;
}
export interface lecturasRegisterForm{
  registros: lecturasForm[];
}
export interface Gestion{
  anio: number|null;
  mes:  string|null;
  barrio:Barrio;
}