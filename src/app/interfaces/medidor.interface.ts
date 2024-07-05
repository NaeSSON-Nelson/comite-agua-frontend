import { Afiliado, Ubicacion } from "./afiliado.interface";
import { ColumnsAlways } from "./always.interface";
import { Barrio, Estado, Medicion } from "./atributes.enum";
import { ComprobantePorPago } from "./pagos-services.interface";


export interface Medidor{
  id?:                number;
  nroMedidor?:        string;
  lecturaInicial?:    number;
  lecturaMedidor?:    number;
  marca?:             string;
  funcionamiento?:    string;
  medidorAsociado?:  MedidorAsociado[];
  isActive?:           boolean;
  estado?:             Estado;
  medicion?:           Medicion;
}
export interface MedidorAsociado{
  id?:                   number;
  lecturaInicial?:       number;
  fechaInstalacion?:     Date;
  estadoMedidorAsociado?:string;
  lecturaSeguimiento?:   number;
  planillas?:             PlanillaLecturas[];
  afiliado?:             Afiliado;
  medidor?:              Medidor;
  ubicacion?:            Ubicacion;
  isActive?:              boolean;
  estado?:                Estado;
  registrable?:            boolean;
}
export interface MedidorForm{
  id?:                number;
  nroMedidor?:        string;
  lecturaInicial?:    number;
  marca?:             string;
  estado?:            Estado;
  funcionamiento?:    string;
  medicion?:           Medicion;
}
export interface MedidorAsociadoForm{
  id?:                   number;
  fechaInstalacion?:     Date;
  estadoMedidorAsociado?:string;
  afiliado?:             Afiliado;
  medidor?:              Medidor;

  barrio?:               Barrio;
  numeroVivienda?:       string;
  longitud?:             string;
  latitud?:              number;
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