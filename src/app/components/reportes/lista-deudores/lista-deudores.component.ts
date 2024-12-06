import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import * as IPdf from 'pdfmake/interfaces'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReportesService } from '../reportes.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetrasoTipo } from 'src/app/interfaces/atributes.enum';
import { Perfil } from '../../../interfaces/perfil.interface';
import { Afiliado, MedidorAsociado, MultaServicio, PlanillaMesLectura, Ubicacion } from 'src/app/interfaces';
import { PlanillaLecturas } from '../../../interfaces/medidor.interface';
import { ExportColumn } from '../../perfiles/perfil-pdf/perfil-pdf.component';
@Component({
  selector: 'app-lista-deudores',
  templateUrl: './lista-deudores.component.html',
  styles: [`
    .header{
      padding:30px 0px 30px 0px;
      font-size: 1.2rem;
      font-weight: 900;
      text-align:left;
      
    }
    .celda-header{

    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaDeudoresComponent {

  loading:boolean=false;
  visibleTable:boolean=false;
  totalGeneral:number=0;
  titleList:string='Lista de deudores morosos obtenidos';
  constructor( private readonly messageService:MessageService,
    private readonly reportesService:ReportesService,
    private cdr: ChangeDetectorRef,
    private fb:FormBuilder,
  ){}
  options=[
    {label:'Retraso un mes',value:RetrasoTipo.mensual},
    {label:'Retrasos de dos meses',value:RetrasoTipo.bimestral},
    {label:'Retrasos de tres meses',value:RetrasoTipo.trimestral},
    {label:'Todos los retrasos',value:RetrasoTipo.demas},
  ]
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    ( <any> pdfMake ).vfs = pdfFonts.pdfMake.vfs;
    
    this.calculateColumnWidths();
  }

  formSelect:FormGroup=this.fb.group({
    tipo:[,Validators.required]
  });
  obtenerDeudores(){
    if(this.formSelect.invalid){
      this.messageService.add({
        severity: 'warn',
        summary: `Se debe mandar un tipo`,
        detail: ``,
        life: 5000,
      });
      return;
    }
    this.loading=true;
    this.visibleTable=false;
    this.reportesService.obtenerDeudores(this.formSelect.value.tipo).subscribe(res=>{
      console.log('result:',res);
      this.loading=false;
      if(res.OK){
        this.data=res.data!;
        this.visibleTable=true;

      }
    })
  }
  data:Perfil[]=[];
  
  limpiarCampo(campo: string) {
    if (
      !this.formSelect.get(campo)?.pristine &&
      this.formSelect.get(campo)?.value?.length === 0
    ) {
      this.formSelect.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.formSelect.controls[nombre].errors &&
      this.formSelect.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.formSelect.controls[nombre].errors &&
      this.formSelect.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.formSelect.controls[nombre].valid &&
        this.formSelect.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }

  getTipoErrors(campo:string){
    const errors = this.formSelect.get(campo)?.errors;
    if(errors?.['required']){
      return 'El campo es requerido';
    }return '';
  }

  // calcularAsocacionesLength(asociaciones:MedidorAsociado[]){
  //   let mayor=1;
  //   for(const asc of asociaciones){
  //     if(asc.planillas!.length>mayor){
  //       mayor=asc.planillas!.length;
  //     }
  //   }
  //   if(asociaciones.length>mayor) mayor = asociaciones.length;
  //   console.log('MAYOR ',mayor);
  //   return mayor;
  // }
  calcularPlanillasLength(asociados:MedidorAsociado[]){
    let calculo:number=0;
    for(const asc of asociados){
      calculo=calculo+asc.planillas!.length;
    }
    return calculo;
  }
  getLecturas(planillas:PlanillaMesLectura[]){
    let lectuasString:string='';
    for(const lectura of planillas){
      lectuasString=lectuasString.concat(`${lectura.PlanillaMesLecturar}\n`);
    }
    return lectuasString
  }
  totalPagarLecturas(planilla:PlanillaLecturas){
    let total:number=0;
    for(const lectura of planilla.lecturas){
      total=total+lectura.pagar!.monto;
    }
    return total;
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }

 columns: ExportColumn[] = [
  { field: 'index', header: 'N°', selected: true },
  { field: 'nombreCompleto', header: 'Nombre Completo', selected: true },
  { field: 'contacto', header: 'Contacto', selected: false },
  { field: 'ubicacion', header: 'Ubicación', selected: true },
  { field :'medidor',header:'Medidores de agua',selected:true},
  { field :'multas',header:'Multas por retraso de pago',selected:true},
  { field :'gestion',header:'Gestiones',selected:true},
  { field :'lecturas',header:'Meses de cobro',selected:true},
  { field :'total',header:'Cobro',selected:true},
];
  get columnsLengthSelected(){
    return this.columns.filter(col=>col.selected).length
  }
  newColumnHeader: string = '';
  calculateColumnWidths() {
    this.columns.forEach(col => {
        col.width = Math.max(col.header.length * 8, 50); // Ancho mínimo de 50
      
    });
  }
  isRequiredField(field: string): boolean {
    return field === 'nombreCompleto' || field ==='index' 
    || field ==='ubicacion'|| field==='medidor'|| field ==='gestion' 
    || field ==='lecturas'|| field ==='total';
  }
  addCustomColumn() {
    if (this.newColumnHeader.trim()) {
      const field = this.newColumnHeader.toLowerCase().replace(/\s+/g, '_');
      this.columns.push({
        field,
        header: this.newColumnHeader,
        selected: true,
        width: Math.max(this.newColumnHeader.length * 8, 70)
      });
      this.newColumnHeader = '';
    }
  }
  getSelectedColumns(): ExportColumn[] {
    return this.columns.filter(col => col.selected);
  }
  getNombreCompleto(profile: Perfil): string {
    const nombres = [profile.nombrePrimero, profile.nombreSegundo].filter(Boolean).join(' ');
    const apellidos = [profile.apellidoPrimero, profile.apellidoSegundo].filter(Boolean).join(' ');
    return `${apellidos} ${nombres}`.trim().toLocaleUpperCase();
  }
  getUbicacion(ubicacion:Ubicacion){
    return `Barrio: ${ubicacion.barrio}\nManzano: ${ubicacion.manzano}-${ubicacion.numeroManzano}\nN° Lote: ${ubicacion.nroLote}`;
  }
  private getColumnAlignment(field: string): string {
    switch (field) {
      case 'CI':
      case 'contacto':
        return 'center';
      case 'fechaNacimiento':
        return 'center';
      default:
        return 'left';
    }
  }
  getMultasAsociado(multas:MultaServicio[]){
    let multasContact:string='';
    if(multas.length>0){

      for(const multa of multas){
        multasContact=multasContact.concat(`N° Multa: ${multa.id}\n`)
        .concat(this.getGestionWithLecturas(multa.lecturasMultadas))
        .concat(`Pago Multa: ${multa.monto} ${multa.moneda}.`)
        .concat(`\n --${multa.pagado?'PAGADO':'NO PAGADO'}--\n`);
      }
    }
    return multasContact.length>0?multasContact:'NINGUNO'
  }
  getGestionWithLecturas(lecturasMultadas:PlanillaMesLectura[]){
    let multadas:string='';
    let gestion:number=0;
    for(const lectura of lecturasMultadas){
      if(lectura.planilla!.gestion>gestion) {
        gestion=lectura.planilla!.gestion;
        multadas=multadas.concat(`- Gestión: ${gestion}\n`);
      }
      multadas=multadas.concat(`${lectura.PlanillaMesLecturar}\n`);
    }
    return multadas;
  }
  exportPDF() {
    const  fechaSolicitada = new Date();
    const asi=fechaSolicitada.toTimeString().split('GMT')[0];
    // this.totalGeneralToExport=0;
    const selectedColumns = this.getSelectedColumns();
    // const dateTime = this.getFormattedDateTime();
    
    // Calcular los anchos de columna
    const pageWidth = 515; // Ancho típico de página A4 en puntos (72 puntos por pulgada)
    const margins = 40; // Márgenes (20 puntos a cada lado)
    const indexWidth=15;
    const availableWidth = pageWidth - (margins * 2)-indexWidth;
    
    
    // Calcular anchos proporcionales para las columnas
    let totalWeight = this.columns.reduce((sum, col) => sum + (col.width || 0), 0);
    let columnWidths: number[]=[];
    columnWidths = selectedColumns.map((val,index) => {
        if(index!==0)
        return  availableWidth / (selectedColumns.length-1)
      else return indexWidth
      });
    //EDIT ESPACIO N°
    
    const tableContent:IPdf.TableCell[][]=[];
    this.data.forEach((perfil,index)=>{
      const row:IPdf.TableCell[]=[];
      let rowInsertado:boolean=false;
      if(perfil.afiliado!.medidorAsociado!.length===1){
        //UN SOLO MEDIDOR DE AGUA
        if(perfil.afiliado!.medidorAsociado![0].planillas!.length===1){
          //UNA SOLA PLANILLA
          row.push(...selectedColumns.map<IPdf.TableCell>(col=>({
            text: col.field === 'index'?index
                : col.field === 'nombreCompleto' ?this.getNombreCompleto(perfil)
                : col.field === 'ubicacion'? this.getUbicacion(perfil.afiliado!.ubicacion!)
                : col.field === 'total'? this.totalPagarLecturas(perfil.afiliado!.medidorAsociado![0].planillas![0])
                : col.field === 'lecturas'? this.getLecturas(perfil.afiliado!.medidorAsociado![0].planillas![0].lecturas)
                : col.field === 'medidor'?perfil.afiliado!.medidorAsociado![0].medidor!.nroMedidor
                : col.field === 'multas'?this.getMultasAsociado(perfil.afiliado!.medidorAsociado![0].multasAsociadas!)
                : col.field === 'gestion'?perfil.afiliado!.medidorAsociado![0].planillas![0].gestion
                : col.field === 'contacto'?perfil.contacto||'' :' NODATA',
            alignment:'left',
          }))
        );
        }else{
          //PLANILLAS DE LA ASOCIACION
          for(const col of selectedColumns){
            if(col.field === 'index'){
              row.push({
                text:index,
                alignment:'center',
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length
              })
            }
            else if(col.field === 'nombreCompleto'){
              row.push({
                text:this.getNombreCompleto(perfil),
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length
              })
            }
            else if(col.field === 'ubicacion'){
              row.push({
                text:this.getUbicacion(perfil.afiliado!.ubicacion!),
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length,
                alignment:'left'
              })
            }
            else if(col.field === 'contacto'){
              row.push({
                text:perfil.contacto ||'',
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length,
              })
            }
            else if(col.field === 'medidor'){
              row.push({
                text:perfil.afiliado!.medidorAsociado![0].medidor!.nroMedidor,
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length,
              })
            }
            else if(col.field === 'multas'){
              row.push({
                text:this.getMultasAsociado(perfil.afiliado!.medidorAsociado![0].multasAsociadas!),
                rowSpan:perfil.afiliado!.medidorAsociado![0].planillas!.length,
              })
            }
            else if(col.field === 'gestion'){
              perfil.afiliado!.medidorAsociado![0].planillas!.forEach((planilla,index)=>{
                if(index===1){
                  if(!rowInsertado){ 
                    tableContent.push(row);
                    rowInsertado=true;
                  }
                }
                if(index>0){
                  const rowAux:IPdf.TableCell[]=[]
                  for(let indiceRow=0;indiceRow<selectedColumns.length-3;indiceRow++){
                    rowAux.push({text:''});
                  }
                  
                  rowAux.push(
                  {
                    text:planilla.gestion
                  },
                  {
                    text:this.getLecturas(planilla.lecturas)
                  },
                  {
                    text:this.totalPagarLecturas(planilla)
                  });
                  tableContent.push(rowAux);
                }else{

                  row.push({
                  text:planilla.gestion
                },{
                  text:this.getLecturas(planilla.lecturas)
                },{
                  text:this.totalPagarLecturas(planilla)
                })
              }
              })
              
            }else{
              console.log('campo no',col.field);
            }
          }
        }
      }else{
        //MAS MEDIDORES ASOCIADOS
        for(const col of selectedColumns){
          if(col.field === 'index'){
            row.push({
              text:index,
              alignment:'center',
              rowSpan:this.calcularPlanillasLength(perfil.afiliado!.medidorAsociado!),
            })
          }
          else if(col.field === 'nombreCompleto'){
            row.push({
              text:this.getNombreCompleto(perfil),
              rowSpan:this.calcularPlanillasLength(perfil.afiliado!.medidorAsociado!)
            })
          }
          else if(col.field === 'ubicacion'){
            row.push({
              text:this.getUbicacion(perfil.afiliado!.ubicacion!),
              rowSpan:this.calcularPlanillasLength(perfil.afiliado!.medidorAsociado!),
              alignment:'left'
            })
          }
          else if(col.field === 'contacto'){
            row.push({
              text:perfil.contacto ||'',
              rowSpan:this.calcularPlanillasLength(perfil.afiliado!.medidorAsociado!),
            })
          }
          else if(col.field === 'medidor'){
           
            perfil.afiliado!.medidorAsociado!.forEach((asc,index)=>{
              if(asc.planillas!.length===1){
              //SI EL MEDIDOR ITERADO TIENE SOLAMENTE UNA PLANILLA  
                if(index===1){
                  if(!rowInsertado){ 
                    tableContent.push(row);
                    rowInsertado=true;
                  }
                }
                if(index>0){
                  const rowAux:IPdf.TableCell[]=[];
                  for(let indiceRow=0;indiceRow<selectedColumns.length-4;indiceRow++){
                    rowAux.push({text:''});
                  }
                  rowAux.push(
                    {
                      text:asc.medidor!.nroMedidor,
                      rowSpan:asc.planillas!.length,
                    },
                    {
                      text:asc.planillas![0].gestion
                    },{
                      text:this.getLecturas(asc.planillas![0].lecturas)
                    },{
                      text:'pago total'
                    }
                  );
                  tableContent.push(rowAux);
                }
                else{
                  row.push(
                  {
                    text:asc.medidor!.nroMedidor,
                    rowSpan:asc.planillas!.length,
                  },
                  {
                    text:this.getMultasAsociado(asc.multasAsociadas!),
                    rowSpan:asc.planillas!.length,
                  },
                  {
                    text:asc.planillas![0].gestion
                  },{
                    text:this.getLecturas(asc.planillas![0].lecturas)
                  },{
                    text:this.totalPagarLecturas(asc.planillas![0])
                  }
                )
                }
              }else{
                //EL MEDIDOR ITERADO TIENE MUCHAS PLANILLAS
                if(index===1){
                  if(!rowInsertado){
                    tableContent.push(row);
                    rowInsertado=true;
                  }
                }
                if(index>0){
                  //SE ENCUENTRA DESDE LA POSICION 1 EN ADELANTE
                  const rowAux:IPdf.TableCell[]=[];
                  let rowAuxInsertado:boolean=false;
                  for(let indiceRow=0;indiceRow<selectedColumns.length-5;indiceRow++){
                    rowAux.push({text:''}); //TODO: PROBAR CON CASOS DE 3 MEDIDORES Y 3 GESTIONES POR CADA MEDIDOR, SI HACE FALTA ROWSPAN AQUI
                  }
                  rowAux.push(
                    {
                      text:asc.medidor!.nroMedidor,
                      rowSpan:asc.planillas!.length,
                    },
                    {
                      text:this.getMultasAsociado(asc.multasAsociadas!),
                      rowSpan:asc.planillas!.length,
                    },
                  );
                  asc.planillas!.forEach((planilla,indPlanilla)=>{
                    if(indPlanilla===1){
                      if(!rowAuxInsertado){
                        tableContent.push(rowAux);
                        rowAuxInsertado=true;
                      }
                    }
                    if(indPlanilla>0){
                      const rowAuxPlanilla:IPdf.TableCell[]=[];
                      for(let indiceRow=0;indiceRow<selectedColumns.length-3;indiceRow++){
                        rowAuxPlanilla.push({text:''});
                      }
                      rowAuxPlanilla.push(
                        {
                          text:planilla.gestion
                        },{
                          text:this.getLecturas(planilla.lecturas)
                        },{
                          text:this.totalPagarLecturas(planilla)
                        }
                      );
                      tableContent.push(rowAuxPlanilla);
                    }else{
                      rowAux.push(
                        {
                          text:planilla.gestion
                        },{
                          text:this.getLecturas(planilla.lecturas)
                        },{
                          text:this.totalPagarLecturas(planilla)
                        }
                      );
                    }
                });

                }else{
                  row.push(
                  {
                    text:asc.medidor!.nroMedidor,
                    rowSpan:asc.planillas!.length,
                  },
                  {
                    text:this.getMultasAsociado(asc.multasAsociadas!),
                    rowSpan:asc.planillas!.length,
                  },
                )
                  asc.planillas!.forEach((planilla,indPlanilla)=>{
                    if(indPlanilla===1){
                      if(!rowInsertado){
                        tableContent.push(row);
                        rowInsertado=true;
                      }
                    }
                    if(indPlanilla>0){
                      const rowAux:IPdf.TableCell[]=[];
                      for(let indiceRow=0;indiceRow<selectedColumns.length-3;indiceRow++){
                        rowAux.push({text:''});
                      }
                      rowAux.push(
                        {
                          text:planilla.gestion
                        },{
                          text:this.getLecturas(planilla.lecturas)
                        },{
                          text:this.totalPagarLecturas(planilla)
                        }
                      );
                      tableContent.push(rowAux);
                    }else{
                      row.push(
                        {
                          text:planilla.gestion
                        },{
                          text:this.getLecturas(planilla.lecturas)
                        },{
                          text:this.totalPagarLecturas(planilla)
                        }
                      );
                    }
                });
                }
              }
            })
            
          }else{
            console.log('campo no',col.field);
          }
        }
        
      }
      if(!rowInsertado){
        tableContent.push(row);
      }
    })
    const docDefinition:IPdf.TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [margins, 40, margins, 40], // [left, top, right, bottom]
      content: [
        { 
          text: 'REPORTES DE PAGOS DE AFILIADOS',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        { 
          text: `Filtro de fechas:`,
          style: 'subheader',
          alignment: 'left',
          margin: [0, 20 , 0, 10]
        },
        { 
          text: `Fecha de inicio: 
          Fecha fin: 
          Hora solicitada: `,
          style: 'subheader',
          alignment: 'left',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [
              // Cabeceras
              selectedColumns.map(col => ({ 
                text: col.header, 
                style: 'tableHeader',
                alignment: 'center'
              })),
              // Datos
              ...tableContent
            ]
          },
          layout: {
            hLineWidth: (i: number) => 0.5,
            vLineWidth: (i: number) => 0.5,
            hLineColor: (i: number) => '#E0E0E0',
            vLineColor: (i: number) => '#E0E0E0',
            paddingLeft: (i: number) => 8,
            paddingRight: (i: number) => 8,
            paddingTop: (i: number) => 8,
            paddingBottom: (i: number) => 8,
          }
        },'\n',
        {
          layout:{
           defaultBorder:false
          },
          table:{
            headerRows: 1,
            widths:['*','auto'],
            body:[
              [
                {
                  text:`TOTAL:\t`,
                  bold: true,
                  fontSize: 10,
                  alignment:'right',
                  // alignment: 'right',
                  border: [false, false, false, true],
                  // margin: [0, 5, 0, 5],
                },
                {
                  text: `${this.totalGeneral.toFixed(2)} Bs.`,
                  bold: true,
                  fontSize: 12,
                  // alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ]
          }
        }
        
      ]
      ,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2C3E50'
        },
        subheader: {
          fontSize: 9,
          color: '#7F8C8D',
          margin: [0, 0, 0, 2]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: '#2C3E50',
          fillColor: '#F8F9FA',
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#2C3E50'
      }
    };

    
  pdfMake.createPdf(docDefinition).download(`perfiles-${'fecha-de-rango'}.pdf`);
  }
}
