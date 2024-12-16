import { Component } from '@angular/core';
import { CobrosService } from '../cobros.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Perfil, Ubicacion } from 'src/app/interfaces';
import * as IPdf from 'pdfmake/interfaces'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { LayoutService } from 'src/app/layout/layout.service';
import { ExportColumn } from '../../perfiles/perfil-pdf/perfil-pdf.component';
@Component({
  selector: 'app-recionexiones-de-servicio',
  templateUrl: './recionexiones-de-servicio.component.html',
  styles: [],
})
export class RecionexionesDeServicioComponent {
  constructor(
    private readonly cobrosService: CobrosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private layoutService:LayoutService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.this.calculateColumnWidths();
    ( <any> pdfMake ).vfs = pdfFonts.pdfMake.vfs; 
    this.obtenerLista();
  }
  data: Perfil[] = [];
  loading: boolean = false;
  title: string = '';
  visibleTable:boolean=false;
  obtenerLista() {
    this.loading=true;
    this.data = [];
    this.medidoresArrayForm.clear();
    this.reconexionesForm.reset();
    this.cobrosService.obtenerListaParaReconexiones().subscribe((res) => {
      console.log('lista de reconexiones', res);
      this.loading=false;
      if (res.OK) {

        this.data = res.data!;
        this.visibleTable=true;
        if (this.data.length === 0) {
          this.title = 'NO HAY AFILIADOS PARA REALIZAR LAS RECONEXIONES DE SUS MEDIDORES DE AGUA';
        } else {
          this.title = '';
        }
      }
    });
  }

  getUbicacion(ubicacion: Ubicacion) {
    let total: string = 'Barrio:\n';
    return total
      .concat(ubicacion.barrio || '')
      .concat(ubicacion.numeroVivienda || '')
      .concat(`\nMazano: ${ubicacion.manzano}-${ubicacion.numeroManzano}`)
      .concat(`\nN° Lote: ${ubicacion.nroLote}`);
  }

  reconexionesForm: FormGroup = this.fb.group({
    reconexionesList: this.fb.array([], [Validators.required]),
  });

  get medidoresArrayForm() {
    return this.reconexionesForm.get('reconexionesList') as FormArray;
  }

  addSelect(event: any) {
    console.log('event add',event);
    const asociacion = this.medidoresArrayForm.value.find(
      (med: any) => med.id === event.data.id
    );

    if (!asociacion) {
      const form = this.fb.group({
        id: [event.data.id, Validators.required],
        // tipoCorte: [event.data.motivoTipoConexion, Validators.required],
      });
      this.medidoresArrayForm.push(form);
    }
  }
  dropSelect(event: any) {
    const asociacion = this.medidoresArrayForm.value.findIndex(
      (med: any) => med.id === event.data.id
    );

    if (asociacion) {
      this.medidoresArrayForm.removeAt(asociacion);
    }
  }

  registrarReconexiones() {
    console.log('FORM', this.reconexionesForm);
    console.log('VALUE FORM', this.reconexionesForm.value);
    if (this.medidoresArrayForm.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ERROR EN VALIDACION',
        detail: `Debe haber seleccionado un afiliado para registrar`,
        life: 2500,
        icon: 'pi pi-times',
      });
      return;
    }
    if (this.reconexionesForm.invalid) {
      return;
    }
    // console.log('send form',this.reconexionesForm.value);
    this.enviarReconexionesDeServicio(this.reconexionesForm.value);
  }

  enviarReconexionesDeServicio(dataForm: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro de registrar las reconexiones de su servicio?`,
      header: 'Confirmar Registro de deuda',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.cobrosService.enviarReconexiones(dataForm).subscribe((res) => {
          console.log(res);
          if (res.OK) {
            this.messageService.add({
              severity: 'success',
              summary: 'REGISTRO DE CORTES REALIZADO',
              detail: res.message,
            });
            this.obtenerLista();
          }
        });
      },
    });
  }
  columns:ExportColumn[]=[
    {field:  'index',header:'N°',selected:true},
    { field: 'nombres', header: 'Nombre completo', selected: true },
    { field: 'nroMedidor', header: 'Medidor de agua', selected: true },
    { field: 'ubicacion', header: 'Ubicación', selected: true },
    { field: 'accion', header: 'Acciones realizada', selected: true },
  ];
  getSelectedColumns(): ExportColumn[] {
    return this.columns.filter(col => col.selected);
  }
  calculateColumnWidths() {
    this.columns.forEach(col => {
      col.width = Math.max(col.header.length * 8, 50); // Ancho mínimo de 50
    });
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
        },
      );
      perfil.afiliado?.medidorAsociado?.forEach((asc:any,index:number)=>{
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
            text:`${this.getUbicacion(asc.ubicacion)}`,
            alignment:'left'
          })
          rowAux.push({
            text:'',
            alignment:'center'
          })
          tableContent.push(rowAux);
        }else{
        row.push({ //MEDIDOR ADD
          text:asc.medidor?.nroMedidor,
          alignment:'left',
        }) //ADD TOTAL PAGO
        row.push({
          text:`${this.getUbicacion(asc.ubicacion)}`,
          alignment:'center'
        })
        row.push({
          text:'',
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
    const docDefinition:IPdf.TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [margins, 40, margins, 40], // [left, top, right, bottom]
      content: [
        { 
          text: 'LISTA DE AFILIADOS PARA RECONEXIÓN DE SERVICIO DE AGUA',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10  ]
        },{
          text:`Fecha solicitada: \n${fechaFormat}`,
          alignment:'left',
          margin: [0, 20, 0, 10]
        },
        {
          text:`Usuario:\n${this.getNombreCompleto(this.layoutService.usuario!.perfil!)}`,
          margin: [0, 10, 0, 10],
          alignment:'left',
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

    
  pdfMake.createPdf(docDefinition).download(`perfiles-para-reconexion-de-servicio-${fechaFormat}.pdf`);
  }
}
