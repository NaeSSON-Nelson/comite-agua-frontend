import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Content, Size, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MedidorAsociado, Perfil } from 'src/app/interfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedidoresAguaService } from '../../medidores-agua.service';
import { ExportColumn } from 'src/app/components/perfiles/perfil-pdf/perfil-pdf.component';
@Component({
  selector: 'app-generar-list-registro-lecturas',
  templateUrl: './generar-list-registro-lecturas.component.html',
  styles: [
  ]
})
export class GenerarListRegistroLecturasComponent {
  @Input()
  visible:boolean=false;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly medidoresService:MedidoresAguaService,
  ){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerAsociacionesExport();
  }
  asociacionesPerfiles:AsociadosExport[]=[]
  obtenerAsociacionesExport(){
    this.medidoresService.obtenerAsociadiosMedidoresExport().subscribe(res=>{
      if(res.OK){
        this.asociacionesPerfiles=res.data!;
      }
    })
  }


  columns: ExportColumn[] = [
    { field: 'index', header: 'N°', selected: true },
    { field: 'nombreCompleto', header: 'Nombre Completo', selected: true },
    { field: 'CI', header: 'CI', selected: false },
    { field: 'contacto', header: 'Contacto', selected: false },
    { field: 'nroMedidor', header: 'N° Medidor', selected: false },
    { field: 'manzano', header: 'N° Manzano', selected: false },
    { field: 'nroLote', header: 'N° Lote', selected: false },
    { field: 'lectura', header: 'Lectura', selected: true },
    { field: 'estadoMedidor', header: 'Estado de medidor', selected: true },
  ];

  newColumnHeader: string = '';
  get columnsLengthSelected(){
    return this.columns.filter(col=>col.selected).length
  }
  calculateColumnWidths() {
    this.columns.forEach(col => {
      col.width = Math.max(col.header.length * 8, 70); // Ancho mínimo de 70
    });
  }

  isRequiredField(field: string): boolean {
    return field === 'nombreCompleto' || field ==='index' ||field ==='lectura' || field ==='estadoMedidor';
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

  getFormattedDateTime(): string {
    return format(new Date(), "d 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
  }

  getSelectedColumns(): ExportColumn[] {
    return this.columns.filter(col => col.selected);
  }

  getNombreCompleto(asociacion:MedidorAsociado): string {
    const nombres = [asociacion.afiliado?.perfil?.nombrePrimero, asociacion.afiliado?.perfil?.nombreSegundo].filter(Boolean).join(' ');
    const apellidos = [asociacion.afiliado?.perfil?.apellidoPrimero, asociacion.afiliado?.perfil?.apellidoSegundo].filter(Boolean).join(' ');
    return `${apellidos} ${nombres}`.trim().toLocaleUpperCase();
  }

  formatDate(date: Date | undefined): string {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  }
// Método auxiliar para determinar la alineación según el tipo de campo
private getColumnAlignment(field: string): string {
  switch (field) {
    case 'CI':
      return 'center';
    case 'contacto':
      return 'center';
    case 'manzano':
      return 'center';
    case 'nroLote':
      return 'center';
    default:
      return 'left';
  }
}
clasificarData(){
  const clasificar:any[][]=[];
  const manzanos = this.obtenerTiposManzanos();
  
  for(const man of manzanos){
    const clasic = this.asociacionesPerfiles.filter(asc=>asc.afiliado?.ubicacion?.manzano === man);
    clasificar.push(clasic);
  }
  return clasificar;
}
obtenerTiposManzanos(){
  const tipos:string[]=[];
  for(const asc of this.asociacionesPerfiles){
    if(!tipos.includes(asc.afiliado!.ubicacion!.manzano!)){
      tipos.push(asc.afiliado!.ubicacion!.manzano!);
    }
  }
  return tipos;
}
    exportPDF() {
    const selectedColumns = this.getSelectedColumns();
    const dateTime = this.getFormattedDateTime();
    const dataClasificada = this.clasificarData();
    console.log(dataClasificada);
    // Calcular los anchos de columna
    const pageWidth = 515; // Ancho típico de página A4 en puntos (72 puntos por pulgada)
    const margins = 40; // Márgenes (20 puntos a cada lado)
    const indexWidth=15;
    const availableWidth = pageWidth - (margins * 2)-indexWidth;
    
    
    // Calcular anchos proporcionales para las columnas
    let totalWeight = selectedColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    let columnWidths: number[];
    
    if (selectedColumns.length <= 10) {
      // Si hay 4 columnas o menos, distribuir el espacio equitativamente
      columnWidths = selectedColumns.map((val,index) => {
        if(index!==0)
        return  availableWidth / (selectedColumns.length-1)
      else return indexWidth
      });
    } else {
      // Si hay más columnas, usar anchos proporcionales basados en el contenido
      columnWidths = selectedColumns.map((col,index) => {
        if(index!==0){

          const minWidth = Math.max(col.width || 0, 70); // Ancho mínimo de 70
          return (minWidth / totalWeight) * availableWidth;
        }else{
          return indexWidth
        }
      });
    }
    // console.log(columnWidths);
    //EDIT ESPACIO N°
    const content:Content=[];
    for(let i=0;i<dataClasificada.length;i++){
      content.push(
        { 
          text: 'Lista de Afiliados para registrar lecturas',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        { 
          text: dateTime,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20],
          
        },{
          text:'MANZANOS TIPO:',
          alignment:'left',
          bold:true,
          fontSize:15
        },{
          text:dataClasificada[i][0].afiliado.ubicacion.manzano,
          alignment:'left',
          fontSize:12,
        }
        ,{
          text: 'Nombre de lecturado 1: .......................................................................',
          alignment: 'left',
          margin: [0, 20, 0, 10]
        }
        ,{
          text: 'Nombre de lecturado 2: .......................................................................',
          alignment: 'left',
          margin: [0, 20, 0, 10]
        }
      );
      content.push(
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
              ...dataClasificada[i].map((asociacion,index) => 
                selectedColumns.map(col => ({
                  text: col.field==='index'? index
                    :col.field === 'nombreCompleto' 
                    ? this.getNombreCompleto(asociacion)
                    :col.field ==='CI'
                    ? asociacion.afiliado?.perfil?.CI
                    :col.field ==='nroMedidor'
                    ? asociacion.medidor?.nroMedidor
                    :col.field ==='contacto'
                    ? asociacion.afiliado?.perfil?.contacto || ''
                    :col.field ==='manzano'
                    ? `${asociacion.afiliado?.ubicacion?.manzano} ${asociacion.afiliado?.ubicacion?.numeroManzano} `
                    :col.field ==='nroLote'
                    ? asociacion.afiliado?.ubicacion?.nroLote
                    : (asociacion[col.field] || ''),
                  alignment: this.getColumnAlignment(col.field),
                  
                }))
              )
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
          },
          pageBreak:i<dataClasificada.length-1?'after':undefined
        }
      );

    }
     
    const docDefinition:TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [margins, 40, margins, 40], // [left, top, right, bottom]
      content:content 
      // [

      //   { 
      //     text: 'Lista de Afiliados para registrar lecturas',
      //     style: 'header',
      //     alignment: 'center',
      //     margin: [0, 0, 0, 5]
      //   },
      //   { 
      //     text: dateTime,
      //     style: 'subheader',
      //     alignment: 'center',
      //     margin: [0, 0, 0, 20],
          
      //   },
      //   {
      //     table: {
      //       headerRows: 1,
      //       widths: columnWidths,
      //       body: [
      //         // Cabeceras
      //         selectedColumns.map(col => ({ 
      //           text: col.header, 
      //           style: 'tableHeader',
      //           alignment: 'center'
      //         })),
      //         // Datos
      //         ...this.asociacionesPerfiles.map((asociacion,index) => 
      //           selectedColumns.map(col => ({
      //             text: col.field==='index'? index
      //               :col.field === 'nombreCompleto' 
      //               ? this.getNombreCompleto(asociacion)
      //               :col.field ==='CI'
      //               ? asociacion.afiliado?.perfil?.CI
      //               :col.field ==='nroMedidor'
      //               ? asociacion.medidor?.nroMedidor
      //               :col.field ==='contacto'
      //               ? asociacion.afiliado?.perfil?.contacto || ''
      //               :col.field ==='manzano'
      //               ? `${asociacion.afiliado?.ubicacion?.manzano} ${asociacion.afiliado?.ubicacion?.numeroManzano} `
      //               :col.field ==='nroLote'
      //               ? asociacion.afiliado?.ubicacion?.nroLote
      //               : (asociacion[col.field] || ''),
      //             alignment: this.getColumnAlignment(col.field)
      //           }))
      //         )
      //       ]
      //     },
      //     layout: {
      //       hLineWidth: (i: number) => 0.5,
      //       vLineWidth: (i: number) => 0.5,
      //       hLineColor: (i: number) => '#E0E0E0',
      //       vLineColor: (i: number) => '#E0E0E0',
      //       paddingLeft: (i: number) => 8,
      //       paddingRight: (i: number) => 8,
      //       paddingTop: (i: number) => 8,
      //       paddingBottom: (i: number) => 8,
      //     }
      //   }
      // ]
      ,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2C3E50'
        },
        subheader: {
          fontSize: 12,
          color: '#7F8C8D',
          margin: [0, 0, 0, 5]
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

    
  pdfMake.createPdf(docDefinition).download(`perfiles-${dateTime}.pdf`);
  }

}
interface AsociadosExport extends MedidorAsociado{

  [key: string]: any;
}