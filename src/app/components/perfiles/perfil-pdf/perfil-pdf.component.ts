import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginatorFind, Perfil } from 'src/app/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Content, Size, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { PerfilService } from '../perfil.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { QueryExportPerfil } from 'src/app/interfaces/Paginator.interface';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-perfil-pdf',
  templateUrl: './perfil-pdf.component.html',
  styles: [
  ]
})
export class PerfilPdfComponent {

  // @Input()
  data:PerfilExport[]=[];
  @Input()
  visible:boolean=false;
  selectores:string[]=[];
  dataInputIndex!:Perfil;
  moreData:boolean=false;
  pdfForm:FormGroup=this.fb.group({
    nombres:[true],
    ci:[true],
    contacto:[false],
    fechaNacimiento:[false],
    direccion:[false],
    profesion:[false],
    genero:[false],
    tipoPerfil:[false],
  })
  freeFieldsForm:FormGroup=this.fb.group({
    field:[],
    freeField:this.fb.array([])
  })
  get freeField(){
    return this.freeFieldsForm.controls['freeField'] as FormArray
  }
  @Output()
  closeDisplayModalTable: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private readonly perfilService:PerfilService,
  
    // private dialogService: DialogService,
    private messageService: MessageService){}
  ngOnInit(): void {
    
    this.calculateColumnWidths();
  }
  addField(){
    this.freeField.markAllAsTouched();
    if(this.freeField.errors) return;
    const field = this.fb.group({
      campo:[,Validators.required]
    })
    this.freeField.push(field);
  }
  deleteItemMenu(index:number) {
    this.freeField.removeAt(index);
  }
  campoValidoArray(nombre: string,index:number) {
    return (
      this.freeField.at(index).get(nombre)?.errors &&
      this.freeField.at(index).get(nombre)?.touched
    );
  }
  inputValidArray(nombre: string,index:number) {
    return this.freeField.at(index).get(nombre)?.errors &&
      this.freeField.at(index).get(nombre)?.touched
      ? 'ng-invalid ng-dirty'
      : this.freeField.at(index).get(nombre)?.valid &&
        this.freeField.at(index).get(nombre)?.touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  campoErrors(index:number,name:string){
    const errors = this.freeField.at(index)?.errors;
    if(errors?.['required']){
      return 'el campo es requerido'
    }return''
  }
  changeVisible(type:boolean){
    
  }
  addCampo(){
    const campo = this.fb.group({
      nombre:[{value:this.freeFieldsForm.get('field')?.value,disabled:true}]
    })
    this.freeField.push(campo);
    this.freeFieldsForm.get('field')?.reset()
  }
  deleteCampo(index:number){
    this.freeField.removeAt(index);
  }
  generatePdf(){
    const contentTableHeader:Content=[];
    const contentTable:TableCell[][]=[];
    // const contentTableBody:Content=[];
    const sizeHeader:Size[]=[];
    Object.entries(this.pdfForm.value).forEach(([key,value])=>{
      if(value){
        const header:Content ={
          text:key.toLocaleUpperCase(),
          bold:true,
          alignment:'center'
        }
        contentTableHeader.push(header)
        sizeHeader.push('auto');
      }
    })
    for(let i=0;i<this.freeField.length;i++){
      const header:Content ={
        text:this.freeField.at(i).get('nombre')?.value||'CAMPO SIN NOMBRE',
        bold:true,
        alignment:'center',
        
      }
      // console.log(this.freeField.at(i).get('campo'));
      contentTableHeader.push(header)
      if(header.text.toString().length<=5)
      sizeHeader.push(header.text.toString().length*10);
      else sizeHeader.push(100)
    }
    // contentTable.push(contentTableHeader);
    for(const per of this.data){
      const field:Content=[];
      for(const [key,value] of Object.entries(this.pdfForm.value)){
        if(value){
          const campo:Content={
            text:' sin campo valido',
          }
          if(key ==='nombres'){
            campo.text=`${per.nombrePrimero} ${per.nombreSegundo|| ''} ${per.apellidoPrimero} ${per.apellidoSegundo||''}`.toLocaleUpperCase()
          }else if(key ==='ci'){
            campo.text=`${per.CI ||''}`;
          } else if(key ==='contacto'){
            campo.text=`${per.contacto|| ''}`;
          } else if(key=== 'fechaNacimiento'){
            campo.text=per.fechaNacimiento?`${per.fechaNacimiento}`:'';
          } else if(key ==='direccion'){
            campo.text = `${per.direccion || ''}`
          } else if(key === 'profesion'){
            campo.text = `${per.profesion||''}`
          } else if(key === 'genero'){
            campo.text = `${per.genero||''}`
          } else if(key ==='tipoPerfil'){
            campo.text = `${per.tipoPerfil||''}`
          }

          field.push(campo);
        }
      }
      if(this.freeField.length>0){
        for(let i=0;i<this.freeField.length;i++){
          const header:Content ={
            text:'',
          }
          field.push(header)
        }
      }
      contentTable.push(field);
    }
    // console.log(this.pdfForm);
    console.log(contentTable);
    contentTable.unshift(contentTableHeader)
    const dd:TDocumentDefinitions={
      header:{
        text:'MARCADOR DE TERRAMODA',
          alignment:'center',
          marginTop:10,
          
      },
      content:[{text: 'Defining column widths', style: 'subheader'},
        'Tables support the same width definitions as standard columns:',
        {
          bold: true,
          ul: [
            'auto',
            'star',
            'fixed value'
          ]
        },
        {
          style: 'tableExample',
          table: {
            
            widths:sizeHeader,
            body: contentTable
            
          }
        },],
      pageSize:'A4',
      pageMargins:[40,60,40,60],
      defaultStyle: {
        fontSize: 15,
        bold: true
      }
    }
    const documentation = pdfMake.createPdf(dd);
    documentation.open();

  }
  query:PaginatorFind={
    limit:500,
    offset:0,
    sort:'apellido',
    order:'DESC',
  }
  optionsFilter:filterExtend[]=[
    {name:'Afiliados',value:'isAfiliado'},
    {name:'perfiles',value:'isActive'}
  ]
  orderBy=[
    {name:'id',value:'id'},
    {name:'Nombres',value:'nombrePrimero'},
    {name:'Apellidos',value:'apellidoPrimero'},
    {name:'Cedula Identidad',value:'CI'},
    {name:'genero',value:'genero'},
    {name:'fecha de Nacimiento',value:'fechaNacimiento'}];
  orderBySelected:any;
  orderTypeBy=[
    {name:'Ascendiente',value:'ASC' ,icon:'pi pi-sort-amount-down-alt'},
    {name:'Descendente',value:'DESC',icon:'pi pi-sort-amount-down'},
  ]  
  orderTypeBySelected:any;
  optionFilterSelected:any[]=[
  ]
  addFilter(event:any){
    // console.log(event);
    console.log('filter selecteds',this.optionFilterSelected);
  }


  /*****
   * IA
   */


  columns: ExportColumn[] = [
    { field: 'index', header: 'N°', selected: true },
    { field: 'id', header: 'ID Perfil', selected: false },
    { field: 'nombreCompleto', header: 'Nombre Completo', selected: true },
    { field: 'CI', header: 'CI', selected: false },
    { field: 'contacto', header: 'Contacto', selected: false },
    { field: 'direccion', header: 'Dirección', selected: false },
    { field: 'profesion', header: 'Profesión', selected: false },
    { field: 'tipoPerfil', header: 'Tipo de Perfil', selected: false },
    { field: 'fechaNacimiento', header: 'Fecha de Nacimiento', selected: false },
    { field: 'genero', header: 'Género', selected: false }
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
    return field === 'nombreCompleto' || field ==='index';
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

  getNombreCompleto(profile: Perfil): string {
    const nombres = [profile.nombrePrimero, profile.nombreSegundo].filter(Boolean).join(' ');
    const apellidos = [profile.apellidoPrimero, profile.apellidoSegundo].filter(Boolean).join(' ');
    return `${apellidos} ${nombres}`.trim().toLocaleUpperCase();
  }

  formatDate(date: Date | undefined): string {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  }
// Método auxiliar para determinar la alineación según el tipo de campo
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
    cargarData(tipo:'PDF'|'EXCEL'){
    const query:QueryExportPerfil={
      id:'true',
      nombrePrimero:'true',
      nombreSegundo:'true',
      apellidoPrimero:'true',
      apellidoSegundo:'true',
      CI:'false',
      contacto:'false',
      direccion:'false',
      fechaNacimiento:'false',
      genero:'false',
      profesion:'false',
      tipoPerfil:'false',
    }  
    const selectedColumns = this.getSelectedColumns();
    for(const select of selectedColumns){
      if(select.field ==='nombreCompleto'){
          query.nombrePrimero='true';
          query.nombreSegundo='true';
          query.apellidoPrimero='true';
          query.apellidoSegundo='true';
      }else if(select.field === 'index'){
      }else{
        if(query[select.field])
        query[select.field]='true'
      }
    }
    // for(const filter of this.optionFilterSelected){
    //   query[filter] = filter.filterValue;
    // }
    if(this.orderBySelected){
      query['sort']=this.orderBySelected.value;
    }
    if(this.orderTypeBySelected){
      query['order']=this.orderTypeBySelected.value;
    }
    console.log('query',query);
      this.perfilService.findPerfilesExport(query).subscribe(res=>{
        console.log('res',res);
        if(res.OK){
          
          this.data=res.data!;
          if(tipo === 'PDF'){
            this.exportPDF();
          }else if(tipo ==='EXCEL'){
            this.exportExcel();
          }
        }
      })
    }
    exportPDF() {
    const selectedColumns = this.getSelectedColumns();
    const dateTime = this.getFormattedDateTime();
    
    // Calcular los anchos de columna
    const pageWidth = 515; // Ancho típico de página A4 en puntos (72 puntos por pulgada)
    const margins = 40; // Márgenes (20 puntos a cada lado)
    const indexWidth=15;
    const availableWidth = pageWidth - (margins * 2)-indexWidth;
    
    
    // Calcular anchos proporcionales para las columnas
    let totalWeight = selectedColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    let columnWidths: number[];
    
    if (selectedColumns.length <= 4) {
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
  
    const docDefinition:TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [margins, 40, margins, 40], // [left, top, right, bottom]
      content: [
        { 
          text: 'Lista de Perfiles',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        { 
          text: dateTime,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
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
              ...this.data.map((profile,index) => 
                selectedColumns.map(col => ({
                  
                  text: col.field ==='index'?index+1
                  :col.field === 'nombreCompleto' 
                    ? this.getNombreCompleto(profile)
                    : col.field === 'fechaNacimiento'
                      ? this.formatDate(profile[col.field])
                      : (profile[col.field] || ''),
                  alignment: this.getColumnAlignment(col.field)
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
          }
        }
      ],
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

  // Actualizar el método exportExcel() en export-modal.component.ts

exportExcel() {
  const selectedColumns = this.getSelectedColumns();
  const dateTime = this.getFormattedDateTime();

  // Crear la hoja de cálculo
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header: selectedColumns.map(col => col.header) });
  
  // Añadir título y fecha en la primera fila
  XLSX.utils.sheet_add_aoa(ws, [
    ['Lista de Perfiles', '', '', '', dateTime], // Título y fecha en la misma fila
    [''], // Línea en blanco
  ], { origin: 'A1' });

  // Añadir los datos
  XLSX.utils.sheet_add_json(ws, this.data.map((profile,indexPerfil) => {
    const row: any = {};
    selectedColumns.forEach((col) => {
      if(col.field ==='index'){
        row[col.field] = indexPerfil+1;
      }else if (col.field === 'nombreCompleto') {
        row[col.header] = this.getNombreCompleto(profile);
      } else if (col.field === 'fechaNacimiento') {
        row[col.header] = this.formatDate(profile[col.field]);
      } else {
        row[col.header] = profile[col.field] || '';
      }
    });
    return row;
  }), { 
    origin: 'A3',
    skipHeader: false
  });

  // Obtener el rango de la hoja
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  // Establecer anchos de columna
  const wscols = selectedColumns.map(col => ({
    wch: Math.max(col.header.length * 1.5, 10)
  }));
  ws['!cols'] = wscols;

  // Aplicar estilos
  // Estilo para el título
  const titleStyle = {
    font: {
      bold: true,
      sz: 14
    },
    alignment: {
      horizontal: 'left'
    }
  };

  // Estilo para la fecha
  const dateStyle = {
    font: {
      bold: false,
      sz: 11
    },
    alignment: {
      horizontal: 'right'
    }
  };

  // Estilo para las cabeceras
  const headerStyle = {
    font: {
      bold: true,
      sz: 11
    },
    alignment: {
      horizontal: 'center'
    },
    fill: {
      fgColor: { rgb: "EEEEEE" }
    }
  };

  // Estilo para las celdas de datos
  const dataStyle = {
    alignment: {
      horizontal: 'left'
    },
    font: {
      sz: 10
    }
  };

  // Aplicar estilos al título
  ws['A1'] = { v: 'Lista de Perfiles', t: 's', s: titleStyle };
  
  // Aplicar estilo a la fecha (asumiendo que está en la columna E)
  const lastCol = XLSX.utils.encode_col(range.e.c);
  ws[`${lastCol}1`] = { v: dateTime, t: 's', s: dateStyle };

  // Aplicar estilos a las cabeceras
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: col });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = headerStyle;
  }

  // Aplicar estilos a los datos
  for (let row = 3; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = dataStyle;
    }
  }

  // Combinar celdas para el título
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: range.e.c - 1 } } // Combina las celdas del título excepto la última columna
  ];

  // Crear el libro y añadir la hoja
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Perfiles');

  // Guardar el archivo
  XLSX.writeFile(wb, `perfiles-${dateTime}.xlsx`);
}

  close() {
    this.visible = false;
  }

}
export interface ExportColumn {
  field: string;
  header: string;
  selected: boolean;
  width?: number;
}
interface filterExport{
  isActive?:'true'|'false';
  isAfiliado?:'true'|'false';
  order?: 'ASC' | 'DESC'; //EL ORDEN QUE VENDRAN
  sort?:'id'| 'nombrePrimero'|'apellidoPrimero'|'CI'|'genero'|'fechaNacimiento'; // POR EL TIPO DE CAMPO A ORDENAR
}
interface filterExtend{
  name:string;
  value:string;
  filterValue?:boolean;
}
interface PerfilExport extends Perfil{
  [key: string]: any; // Para columnas dinámicas
}