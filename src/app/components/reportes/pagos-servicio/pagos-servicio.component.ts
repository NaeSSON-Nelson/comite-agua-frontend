import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DateArrayValidators } from '../validators/date-array-validators';
import {CALENDER_CONFIG_ES} from '../../../common/calendar.config'
import { ReportesService } from '../reportes.service';
import { MedidorAsociado, MultaServicio, Perfil } from 'src/app/interfaces';
import { ExportColumn } from '../../perfiles/perfil-pdf/perfil-pdf.component';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as IPdf from 'pdfmake/interfaces'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-pagos-servicio',
  templateUrl: './pagos-servicio.component.html',
  styleUrls: ['./pagos-servicio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagosServicioComponent {

  rangeDates: Date[]=[];
  minDate!: Date;

  maxDate!: Date;
  data:Perfil[]=[];
  loading:boolean=false;
  ngOnInit() {
      let today = new Date();
      let month = today.getMonth();
      let year = today.getFullYear();
      let prevMonth = (month === 0) ? 11 : month -1;
      let prevYear = (prevMonth === 11) ? year - 1 : year;
      let nextMonth = (month === 11) ? 0 : month + 1;
      let nextYear = (nextMonth === 0) ? year + 1 : year;
      this.minDate = new Date(2010,0,1,0,0,0,0);
      this.calculateColumnWidths();
      ( <any> pdfMake ).vfs = pdfFonts.pdfMake.vfs;  
  }
  constructor(
    private fb:FormBuilder,
    private readonly messageService:MessageService,
    private readonly reportesService:ReportesService,
    private readonly layoutService:LayoutService,
    private cdr: ChangeDetectorRef
  ){}
  LIMITE_DAY:number=(82800000+3540000+59000);
  obtenerData(){
    if(this.calendarForm.invalid){
      this.messageService.add({
        severity: 'warn',
        summary: `Se debe mandar una rango de fechas`,
        detail: ``,
        life: 5000,
      });
      return;
    };

    const inicio = this.calendarForm.value.calendarRange[0];
    const fin = this.calendarForm.value.calendarRange[1];
    const finDay = new Date((fin.getTime()+this.LIMITE_DAY));
    this.obtenerDataList(inicio,finDay);
  }

  calendarForm:FormGroup=this.fb.group({
    calendarRange:[,[Validators.required,DateArrayValidators.dateArrayValidator(2,2)]]
  });
  visibleTable:boolean=false;
  obtenerDataList(fechaInicio:Date,fechaFin:Date){
    this.loading=true;
    this.reportesService.obtenerPagosServicio(fechaInicio,fechaFin).subscribe(res=>{
      
      this.loading=false;
      if(res.OK){
        this.data=res.data!;
        this.visibleTable=true;
      }
    })
  }

  limpiarCampo(campo: string) {
    if (
      !this.calendarForm.get(campo)?.pristine &&
      this.calendarForm.get(campo)?.value?.length === 0
    ) {
      this.calendarForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.calendarForm.controls[nombre].errors &&
      this.calendarForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.calendarForm.controls[nombre].errors &&
      this.calendarForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.calendarForm.controls[nombre].valid &&
        this.calendarForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }


  getCalendarRangeErrors(campo:string){
    const errors = this.calendarForm.get(campo)?.errors;
    
    if(errors?.['required']){
      return 'El campo de fechas es requerido'
    }else if(errors?.['invalidDateArray']){
      return 'La fecha debe ser un rango de fechas'
    }
    return '';
  }
  totalPagosAsociado(asociado:MedidorAsociado){
    let total:number=0;
    if(asociado.planillas!.length>0){
    
      for(const planilla of asociado.planillas!){
        for(const lectura of planilla.lecturas){
          // console.log('lectura pago',lectura);
          total = Number.parseFloat(lectura.pagar!.comprobante.montoPagado)+total
        }
      }
    }
    return total;
  }
  totalPagosMultasAsociado(multas:MultaServicio[]){
    let totalMultas:number=0;
    if(multas?.length>0){
      for(const multa of multas){
        // console.log('multa pgo',multa);
        totalMultas = Number.parseFloat(multa.comprobante.montoPagado)+totalMultas;
      }
    }
    return totalMultas;
  }
  totalPagosAll(asociado:MedidorAsociado,multas:MultaServicio[]){
    let total:number=0;
    if(asociado.planillas!.length>0){
    
      for(const planilla of asociado.planillas!){
        for(const lectura of planilla.lecturas){
          total = Number.parseFloat(lectura.pagar!.comprobante.montoPagado)+total
        }
      }
    }
    if(multas?.length>0){
      for(const multa of multas){
        total = Number.parseFloat(multa.comprobante.montoPagado)+total;
      }
    }
    return total;
  }
  totalPagosAsociadoToExport(asociado:MedidorAsociado){
    let total:number=0;
    if(asociado.planillas!.length>0){
    
      for(const planilla of asociado.planillas!){
        for(const lectura of planilla.lecturas){
          // console.log('lectura pago',lectura);
          total = Number.parseFloat(lectura.pagar!.comprobante.montoPagado)+total
        }
      }
    }
    return total;
  }
  totalPagosMultasAsociadoToExport(multas:MultaServicio[]){
    let totalMultas:number=0;
    if(multas?.length>0){
      for(const multa of multas){
        // console.log('multa pgo',multa);
        totalMultas = Number.parseFloat(multa.comprobante.montoPagado)+totalMultas;
      }
    }
    return totalMultas;
  }
  totalGeneralToExport:number=0;
  totalPagosAllToExport(asociado:MedidorAsociado,multas:MultaServicio[]){
    let total:number=0;
    if(asociado.planillas!.length>0){
    
      for(const planilla of asociado.planillas!){
        for(const lectura of planilla.lecturas){
          total = Number.parseFloat(lectura.pagar!.comprobante.montoPagado)+total
        }
      }
    }
    if(multas?.length>0){
      for(const multa of multas){
        total = Number.parseFloat(multa.comprobante.montoPagado)+total;
      }
    }
    this.totalGeneralToExport=this.totalGeneralToExport+total;
    return total;
  }


  columns:ExportColumn[]=[
    {field:  'index',header:'N°',selected:true},
    { field: 'nombres', header: 'Nombre completo', selected: true },
    { field: 'nroMedidor', header: 'Medidor de agua', selected: true },
    { field: 'totalLecturas', header: 'Total de lecturas pagadas', selected: true },
    { field: 'totalMultas', header: 'Total de multas pagadas', selected: true },
    { field: 'total', header: 'Total', selected: true },
  ];
  get columnsLengthSelected(){
    return this.columns.filter(col=>col.selected).length
  }
  calculateColumnWidths() {
    this.columns.forEach(col => {
      col.width = Math.max(col.header.length * 8, 50); // Ancho mínimo de 50
    });
  }
  getSelectedColumns(): ExportColumn[] {
    return this.columns.filter(col => col.selected);
  }
  getNombreCompleto(profile: Perfil): string {
    const nombres = [profile.nombrePrimero, profile.nombreSegundo].filter(Boolean).join(' ');
    const apellidos = [profile.apellidoPrimero, profile.apellidoSegundo].filter(Boolean).join(' ');
    return `${apellidos} ${nombres}`.trim().toLocaleUpperCase();
  }
  getFechaFormat(fechaSolicitada:Date){
    return `${fechaSolicitada.getDate()}-${fechaSolicitada.getMonth()+1}-${fechaSolicitada.getFullYear()} ${fechaSolicitada.getHours()}:${fechaSolicitada.getMinutes()}`;
  }
  exportPDF() {
    const  fechaSolicitada = new Date();
    const asi=fechaSolicitada.toTimeString().split('GMT')[0];
    this.totalGeneralToExport=0;
    const fechaFormat=this.getFechaFormat(fechaSolicitada);
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
    console.log('totalweith',totalWeight);
    // if (selectedColumns.length <= 4) {
      // Si hay 4 columnas o menos, distribuir el espacio equitativamente
    columnWidths = selectedColumns.map((val,index) => {
        if(index!==0)
        return  availableWidth / (selectedColumns.length-1)
      else return indexWidth
      });
    // } 
    // else {
    //   // Si hay más columnas, usar anchos proporcionales basados en el contenido
    //   columnWidths = selectedColumns.map((col,index) => {
    //     if(index!==0){

    //       const minWidth = Math.max(col.width || 0, 70); // Ancho mínimo de 70
    //       return (minWidth / totalWeight) * availableWidth;
    //     }else{
    //       return indexWidth
    //     }
    //   });
    // }
    // console.log(columnWidths);
    //EDIT ESPACIO N°

    const tableContent:IPdf.TableCell[][]=[];
    this.data.forEach((perfil,index)=>{
      const row:IPdf.TableCell[]=[];
      let rowInsertado:boolean=false;
      row.push(
        {
          text:index+1,
          rowSpan:perfil.afiliado?.medidorAsociado?.length,
          alignment:'center'
        },
        {
        text:this.getNombreCompleto(perfil),
        rowSpan:perfil.afiliado?.medidorAsociado?.length,
        alignment:'left'
      });
      perfil.afiliado?.medidorAsociado?.forEach((asc,index)=>{
        if(index>0){
          if(!rowInsertado){

            tableContent.push(row);
            rowInsertado=true;
          }
          const rowAux:IPdf.TableCell[]=[];
          rowAux.push( //TEXT ESPACIADOS
            {text:'text'},
            {text:'text'},
          );
          rowAux.push({ //MEDIDOR ADD
            text:asc.medidor?.nroMedidor,
            alignment:'left',
          }) //ADD TOTAL PAGO
          rowAux.push({
            text:`${this.totalPagosAsociadoToExport(asc).toFixed(2)} ${asc.planillas![0].lecturas[0].pagar?.comprobante.moneda}.`,
            alignment:'center'
          })
          rowAux.push({
            text:`${this.totalPagosMultasAsociadoToExport(asc.multasAsociadas!).toFixed(2)} Bs.`,
            alignment:'center'
          })
          rowAux.push({
            text:`${this.totalPagosAllToExport(asc,asc.multasAsociadas!).toFixed(2)} Bs.`,
            alignment:'center'
          })
          tableContent.push(rowAux);
        }else{
        row.push({ //MEDIDOR ADD
          text:asc.medidor?.nroMedidor,
          alignment:'left',
        }) //ADD TOTAL PAGO
        row.push({
          text:`${this.totalPagosAsociadoToExport(asc).toFixed(2)} ${asc.planillas![0].lecturas[0].pagar?.comprobante.moneda}.`,
          alignment:'center'
        })
        row.push({
          text:`${this.totalPagosMultasAsociadoToExport(asc.multasAsociadas!).toFixed(2)} Bs.`,
          alignment:'center'
        })
        row.push({
          text:`${this.totalPagosAllToExport(asc,asc.multasAsociadas!).toFixed(2)} Bs.`,
          alignment:'center'
        })
      }
      });
      if(!rowInsertado){
        tableContent.push(row);
      }
    })
    console.log('armando pdf');
    console.log('columns width',columnWidths);
    console.log('selectedWidhts', selectedColumns);
    const docDefinition:TDocumentDefinitions = {
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
          columns:[
            {
              text:`Fecha solicitada: \n${fechaFormat} \n\n Usuario:\n${this.getNombreCompleto(this.layoutService.usuario!.perfil!)}`,
              alignment:'left',
              margin:[0,10,0,10]
            },
          //   {
          //   columns:[
          //     {
          //       text:`Fecha solicitada: \n${fechaFormat}`,
          //       alignment:'left',
          //       margin: [0, 0, 0, 10]
          //     },
          //     {
          //       text:`Usuario:\n${this.getNombreCompleto(this.layoutService.usuario!.perfil!)}`,
          //       margin: [0, 10, 0, 10],
          //       alignment:'left',
          //     },
          //   ]
          // },
          {
            columns:[
              {
                
                text: `Filtro de fechas:\n\n Fecha de inicio: ${this.calendarForm.value.calendarRange[0].toLocaleDateString()}
                Fecha fin: ${this.calendarForm.value.calendarRange[1].toLocaleDateString()}
                Hora solicitada: ${asi}`,
                
                alignment: 'left',
                margin: [80, 10 , 0, 10]
              },
              // { 
              //   text: `Filtro de fechas:`,
              //   style: 'subheader',
              //   alignment: 'left',
              //   margin: [0, 20 , 0, 10]
              // },
              // { 
              //   text: `Fecha de inicio: ${this.calendarForm.value.calendarRange[0].toLocaleDateString()}
              //   Fecha fin: ${this.calendarForm.value.calendarRange[1].toLocaleDateString()}
              //   Hora solicitada: ${asi}`,
              //   style: 'subheader',
              //   alignment: 'left',
              //   margin: [0, 0, 0, 10],
              // },

            ]
          },
          ]
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
                  text: `${this.totalGeneralToExport.toFixed(2)} Bs.`,
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


  
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }
 totalGeneral(){
  let total:number=0;
  for(const perfil of this.data){
    for(const asc of perfil.afiliado!.medidorAsociado!){
      for(const planilla of asc.planillas!){
        for(const lectura of planilla.lecturas){
          total=total+Number.parseFloat(lectura.pagar!.comprobante.montoPagado);
        }
      }
      for(const multas of asc.multasAsociadas!){
        total=total+Number.parseFloat(multas.comprobante.montoPagado);
      }
    }
  }
  return total;
 }
}
