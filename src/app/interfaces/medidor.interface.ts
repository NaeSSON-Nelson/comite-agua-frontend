import { Afiliado, Ubicacion } from "./afiliado.interface";
import { ColumnsAlways } from "./always.interface";
import { Barrio } from "./atributes.enum";
import { ComprobantePorPago } from "./pagos-services.interface";


export interface Medidor extends ColumnsAlways{
  id?:                number;
  nroMedidor?:        string;
  fechaInstalacion?:  Date;
  lecturaInicial?:    number;
  ultimaLectura?:     number;
  ubicacion?:         Ubicacion;
  marca?:             string;
  afiliado?:          Afiliado;
  planillas?:          PlanillaLecturas[];
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
  lecturaPorPagar?:ComprobantePorPago;
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
  barrio?:Barrio;
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
  mes:string;
  anio:number;
  lecturas: lecturasForm[];
}
export interface Gestion{
  anio: number|null;
  mes:  string|null;
  barrio:Barrio;
}