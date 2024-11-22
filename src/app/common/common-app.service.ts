import { Injectable } from '@angular/core';
import { Barrio, Estado, Genero, PlanillaMesLectura, Perfil, TipoPerfil, MultaServicio } from '../interfaces';
import { Medicion, Monedas, Nivel } from '../interfaces/atributes.enum';
import * as IPdf from 'pdfmake/interfaces'
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IMAGE_APPLAT } from 'src/assets/img/image-applat';
import { PlanillaLecturas } from '../interfaces/medidor.interface';
import { AuthService } from '../auth/auth.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface Values<T>{
  name:   string;
  value:  T;
}
export interface MenuIcon{
  name: string;
  icon:  string;
}
@Injectable({
  providedIn: 'root'
})
export class CommonAppService {

  
  private _estados:Values<string>[]=[
    {name:'ACTIVO',value:Estado.ACTIVO},
    {name:'DESHABILITADO',value:Estado.DESHABILITADO},
    // {name:'INACTIVO',value:Estado.INACTIVO},
    // {name:'PROCESO',value:Estado.PROCESO},
    // {name:'SUSPENDIDO',value:Estado.SUSPENDIDO},
  ]
  
  private _generos:Values<Genero>[]=[
    {name:'MASCULINO',value:Genero.MASCULINO},
    {name:'FEMENINO',value:Genero.FEMENINO},
  ]
  private _barrios:Values<any>[]=[
    // {name:'TODOS',value:null},
    {name:'20 DE MARZO',value:Barrio._20DeMarzo},
    {name:'MENDEZ FORTALEZA',value:Barrio.mendezFortaleza},
    {name:'PRIMAVERA',value:Barrio.primavera},
    {name:'SAN ANTONIO',value:Barrio.sanAntonio},
    {name:'VERDE OLIVO',value:Barrio.verdeOlivo},
  ]
  private _barriosForm:Values<any>[]=[
    {name:'20 DE MARZO',value:Barrio._20DeMarzo},
    {name:'MENDEZ FORTALEZA',value:Barrio.mendezFortaleza},
    {name:'PRIMAVERA',value:Barrio.primavera},
    {name:'SAN ANTONIO',value:Barrio.sanAntonio},
    {name:'VERDE OLIVO',value:Barrio.verdeOlivo},
  ]
  private _tipoPerfil:Values<TipoPerfil>[]=[
    {name:'AFILIADO',value:TipoPerfil.AFILIADO},
    {name:'ADMINISTRATIVO',value:TipoPerfil.ADMINISTRATIVO},
  ];
  private _iconsMenus:MenuIcon[]=[
    { name:'',icon:''}
  ];
  private _nivelesRoles:Values<Nivel>[]=[
    {name:'STANDAR',value:Nivel.afiliado},
    {name:'RESPONSABILITY',value:Nivel.contador},
    {name:'SUPERIOR',value:Nivel.administrativo},
  ]
  private _mediciones:Values<Medicion>[]=[
    {name:'mt3: metros cúbicos',value:Medicion.mt3},
    {name:'ft3: pies cúbicos',value:Medicion.ft3},
  ]
  private _registrables:Values<boolean>[]=[
    {name:'SI',value:true },
    {name:'NO',value:false}
  ]
  private _monedas:Values<Monedas>[]=[
    {name:'Bs.',value:Monedas.Bs },
  ]
  get estados(){
    return [...this._estados];
  }
  get monedas(){
    return [...this._monedas];
  }
  get generos(){
    return [...this._generos];
  }
  get barrios(){
    return [...this._barrios];
  }
  get barriosForm(){
    return [...this._barriosForm];
  }
  get tipoPerfiles(){
    return [...this._tipoPerfil];
  }
  get niveles(){
    return [...this._nivelesRoles];
  }
  get mediciones(){
    return [...this._mediciones];
  }

  get registrables(){
    return [...this._registrables];
  }
  constructor(
    private readonly authService:AuthService,
  ){}
  comprobantesPdfGenerated(lecturas:PlanillaMesLectura[],afiliado:Perfil){
    console.log(lecturas);
    console.log(afiliado);
    const content:IPdf.TableCell[][]=[];
    content.push([
                  
      {
        border: [true, true, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 1',
        alignment:'center'
      },
      {
        border: [false, true, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 2'
      },
      {
        border: [false, true, true, false],
        fillColor: '#eeeeee',
        text: 'fajado 3'
      }
    ],
    [
        {
        border: [true, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 4'
      },  
        {
        border: [false, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 5'
      },  
        {
        border: [false, false, true, false],
        fillColor: '#eeeeee',
        text: 'fajado 6'
      },  
    ],
    [
        {
        border: [true, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 7'
      },  
        {
        border: [false, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 8'
      },  
        {
        border: [false, false, true, false],
        fillColor: '#eeeeee',
        text: 'fajado 9'
      },  
    ],
    [
        {
        border: [true, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 10'
      },  
        {
        border: [false, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 11'
      },  
        {
        border: [false, false, true, false],
        fillColor: '#eeeeee',
        text: 'fajado 12'
      },  
    ],
    [
        {
        border: [true, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 13'
      },  
        {
        border: [false, false, false, false],
        fillColor: '#eeeeee',
        text: 'fajado 14'
      },  
        {
        border: [false, false, true, false],
        fillColor: '#eeeeee',
        text: 'fajado 15'
      },  
    ],
    [
      {
        border: [true, true, true, true],
        fillColor: '#eeeeff',
        text: 'TITULO 1',
        fontSize:15,
        color:'black',
        alignment: 'center'
      },
      {
        border: [true, true, true, true],
        fillColor: '#eeeeff',
        text: 'TITULO 2',
        fontSize:15,
        color:'black',
        alignment: 'center'
      },
      {
        border: [true, true, true, true],
        fillColor: '#eeeeff',
        text: 'TITULO 3',
        fontSize:15,
        color:'black',
        alignment: 'center'
      },
    ],
    [
      '',
      {
        border: [true, true, true, true],
        fillColor: '#eeffee',
        text: '\n'
      },
      ''
    ],
    [
      '',
      {
        border: undefined,
        fillColor: '#eeeeee',
        text: '\n'
      },
      {
        border: [false, false, true, true],
        fillColor: '#dddddd',
        text: ''
      }
    ])
    console.log(content);
    const dd:IPdf.TDocumentDefinitions={
      // a string or { width: number, height: number }
      pageSize: 'RA4',
      pageOrientation: 'landscape',
      watermark: { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 40, 60, 40, 60 ],
        content: [
          {
            style: 'tableExample',
			      color: '#444',
            table: {
              body: 
                content
              
            }
          }
          ]
    }  
    pdfMake.createPdf(dd).open();
  }


  generarReciboDePago(gestionesRecibos:PlanillaLecturas[],afiliado:Perfil){
    const imageRecibo:IPdf.Column={
      image:IMAGE_APPLAT,
      width: 200,
    };
    const tituloRecibo:IPdf.Column[]=[
      {
        text: 'RECIBO DE COBRO DE SERVICIO DE AGUA POTABLE',
        color: '#333333',
        // width: '*',
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      {
        stack: [
          {
            columns: [
              {
                text: 'Fecha Creada',
                color: '#aaaaab',
                bold: true,
                width: '*',
                fontSize: 9,
                alignment: 'right',
              },
              {
                text: `${gestionesRecibos[0].lecturas[0].pagar?.comprobante.created_at}`,
                bold: true,
                color: '#333333',
                fontSize: 9,
                alignment: 'right',
                width: 100,
              },
            ],
          },
        ],
      },
    ];
    const fromToColumns:IPdf.Column[]=[
      {
        text: 'CAJA',
        color: '#aaaaab',
        bold: true,
        fontSize: 8,
        alignment: 'left',
        margin: [0, 5, 0, 5],
      },
      {
        text: 'AFILIADO DE PAGO',
        color: '#aaaaab',
        bold: true,
        fontSize: 8,
        alignment: 'left',
        margin: [0, 5, 0, 5],
      },
    ]
    const YourNameClientNameColumns:IPdf.Column[]=[
      {
        text: 'Your Name \n Your Company Inc.',
        bold: true,
        color: '#333333',
        alignment: 'left',
        fontSize:12
      },
      {
        text: `${afiliado.apellidoPrimero?.toLocaleUpperCase()} ${afiliado.apellidoSegundo?afiliado.apellidoSegundo?.charAt(0).toLocaleUpperCase()+'.':''}\n${afiliado.nombrePrimero?.toLocaleUpperCase()} ${afiliado.nombreSegundo ? afiliado.nombreSegundo?.toLocaleUpperCase():''}`,
        bold: true,
        color: '#333333',
        alignment: 'left',
        fontSize:12
      },
    ];
    const tituloDetallesRecibo:IPdf.Column=
    {
      width: '100%',
      alignment: 'center',
      text: 'DETALLES DE LA TARIFA DE PAGO',
      bold: true,
      margin: [0, 5, 0, 5],
      fontSize: 12,
    }

    const bodyTable:IPdf.TableCell[][]=[
      [
        {
          text: 'GESTION',
          fillColor: '#eaf2f5',
          border: [false, true, false, true],
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9,
        },
        {
          text: 'MES',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'LECTURA REGISTRADA',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'CONSUMIDO',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'TARIFA',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
      ],
    ];
    let totalPago=0;
    for(const {gestion,lecturas} of gestionesRecibos){
      for(let i=0;i<lecturas.length;i++){
        const cell:IPdf.TableCell[]=[];
        if(i===0)
          if(lecturas.length>1){
              cell.push({
                text: gestion,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
                rowSpan:lecturas.length,
              })
            }else{
              cell.push({
                text: gestion,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
              })
            }
          else cell.push({text:''})
          cell.push(
            {
              text: lecturas[i].PlanillaMesLecturar,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            }
            ,{
              text:`${lecturas[i].lectura } ${lecturas[i].medicion}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            }
            ,{
              text:`${lecturas[i].consumoTotal} ${lecturas[i].medicion}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            }
            ,{
              text:`${lecturas[i].pagar?.comprobante.montoPagado} ${lecturas[i].pagar?.comprobante.moneda}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            }
          )
          totalPago+=lecturas[i].pagar?.monto!;
          bodyTable.push(cell)
      }
    }
    const dd:IPdf.TDocumentDefinitions = {
      content: [
        {
          columns: [
            imageRecibo,
            tituloRecibo,
          ],
        },
        {
          columns: fromToColumns,
        },
        {
          columns:YourNameClientNameColumns,
        },tituloDetallesRecibo,
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 2;
            },
            paddingRight: function(i, node) {
              return 2;
            },
            paddingTop: function(i, node) {
              return 1;
            },
            paddingBottom: function(i, node) {
              return 1;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', '*','*','*','*'],
            body: bodyTable,
          },
        },
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 3;
            },
            paddingRight: function(i, node) {
              return 3;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'TOTAL DE COBRO',
                  bold: true,
                  fontSize: 12,
                  // alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${totalPago} ${gestionesRecibos[0].lecturas[0].pagar?.moneda}.`,
                  bold: true,
                  fontSize: 12,
                  // alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        // {
        //   text: 'NOTES',
        //   style: 'notesTitle',
        // },
        // {
        //   text: 'Some notes goes here \n Notes second line',
        //   style: 'notesText',
        // },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        // columnGap: 20,
        //font: 'Quicksand',
      },
      pageSize:'A5',
      pageOrientation:'landscape',
      pageMargins:[25,25],
    //   pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
    //     return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
    //  },
    
    };
    pdfMake.createPdf(dd).open();
    return true;
  }
  generarReciboDePagoDeMultas(multas:MultaServicio[],afiliado:Perfil){
    const imageRecibo:IPdf.Column={
      image:IMAGE_APPLAT,
      width: 200,
    };
    const tituloRecibo:IPdf.Column[]=[
      {
        text: 'RECIBO DE COBRO DE SERVICIO DE AGUA POTABLE',
        color: '#333333',
        // width: '*',
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      {
        stack: [
          {
            columns: [
              {
                text: 'Fecha Creada',
                color: '#aaaaab',
                bold: true,
                width: '*',
                fontSize: 9,
                alignment: 'right',
              },
              {
                text: `${multas[0].comprobante.fechaEmitida}`,
                bold: true,
                color: '#333333',
                fontSize: 9,
                alignment: 'right',
                width: 100,
              },
            ],
          },
        ],
      },
    ];
    const fromToColumns:IPdf.Column[]=[
      {
        text: 'CAJA',
        color: '#aaaaab',
        bold: true,
        fontSize: 8,
        alignment: 'left',
        margin: [0, 5, 0, 5],
      },
      {
        text: 'AFILIADO DE PAGO',
        color: '#aaaaab',
        bold: true,
        fontSize: 8,
        alignment: 'left',
        margin: [0, 5, 0, 5],
      },
    ]
    const user = this.authService.user;

    const YourNameClientNameColumns:IPdf.Column[]=[
      {
        text: `${user.username ||'username'} \n ASOCIACIÓN DE AGUA POTABLE LOMA ALTA DE TOMATITAS`,
        bold: true,
        color: '#333333',
        alignment: 'left',
        fontSize:9
      },
      {
        text: `${afiliado.apellidoPrimero?.toLocaleUpperCase()} ${afiliado.apellidoSegundo?afiliado.apellidoSegundo?.charAt(0).toLocaleUpperCase()+'.':''}\n${afiliado.nombrePrimero?.toLocaleUpperCase()} ${afiliado.nombreSegundo ? afiliado.nombreSegundo?.toLocaleUpperCase():''}`,
        bold: true,
        color: '#333333',
        alignment: 'left',
        fontSize:9
      },
    ];
    const tituloDetallesRecibo:IPdf.Column=
    {
      width: '100%',
      alignment: 'center',
      text: 'DETALLES DE LA TARIFA DE PAGO',
      bold: true,
      margin: [0, 5, 0, 5],
      fontSize: 10,
    }

    const bodyTable:IPdf.TableCell[][]=[
      [
        {
          text: 'GESTION',
          fillColor: '#eaf2f5',
          border: [false, true, false, true],
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9,
        },
        {
          text: 'MES',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'LECTURA REGISTRADA',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'CONSUMIDO',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
        {
          text: 'TARIFA',
          border: [false, true, false, true],
          // alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
          fontSize:9
        },
      ],
    ];
    let totalPago=0;
    
    for(const {lecturasMultadas:lecturas} of multas){
      for(let i=0;i<lecturas.length;i++){
        const cell:IPdf.TableCell[]=[];
        if(i===0)
          if(lecturas.length>1){
              cell.push({
                text: lecturas[i].planilla?.gestion,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
                rowSpan:lecturas.length,
                fontSize:8,
              })
            }else{
              cell.push({
                text: lecturas[i].planilla?.gestion,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
                fontSize:8,
              })
            }
          else cell.push({text:''})
          cell.push(
            {
              text: lecturas[i].PlanillaMesLecturar,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],fontSize:8,
            }
            ,{
              text:`${lecturas[i].lectura } ${lecturas[i].medicion}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],fontSize:8,
            }
            ,{
              text:`${lecturas[i].consumoTotal} ${lecturas[i].medicion}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],fontSize:8,
            }
            ,{
              text:`${lecturas[i].pagar?.comprobante.montoPagado} ${lecturas[i].pagar?.comprobante.moneda}`,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],fontSize:10,
            }
          )
          totalPago+=lecturas[i].pagar?.monto!;
          bodyTable.push(cell)
      }
    }
    const colMultas:IPdf.TableCell[]=[
      {
        text: 'N° MULTA',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        fontSize:9,
        alignment:'center'
      },
      {
        colSpan:3,
        text: 'MOTIVO',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        fontSize:9,
        alignment:'center'
      },
      {text:'',fillColor: '#eaf2f5',border: [false, true, false, true],
        margin: [0, 5, 0, 5]},
      {text:'',fillColor: '#eaf2f5',border: [false, true, false, true],
        margin: [0, 5, 0, 5]},
      {
        text: 'MONTO DE MULTA',
        fillColor: '#eaf2f5',
        border: [false, true, false, true],
        margin: [0, 5, 0, 5],
        textTransform: 'uppercase',
        fontSize:9,
        alignment:'center'
      },
    ]
    bodyTable.push(colMultas);
    for(const multa of multas){
      const cell:IPdf.TableCell[]=[];
      cell.push(
        {
          text: multa.id,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment:'center',
          fontSize:8
        }
        ,{
          text:multa.motivo,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment:'center',
          colSpan:3,
          fontSize:8
        }
        ,
        {text:''},{text:''},
        {
          text:`${multa.comprobante.montoPagado} ${multa.comprobante.moneda}.`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment:'center',
          fontSize:10
        }
        
      )
      totalPago=totalPago+Number.parseFloat(multa.monto);
      bodyTable.push(cell);
    }
    const dd:IPdf.TDocumentDefinitions = {
      content: [
        {
          columns: [
            imageRecibo,
            tituloRecibo,
          ],
        },
        {
          columns: fromToColumns,
        },
        {
          columns:YourNameClientNameColumns,
        },tituloDetallesRecibo,
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 2;
            },
            paddingRight: function(i, node) {
              return 2;
            },
            paddingTop: function(i, node) {
              return 1;
            },
            paddingBottom: function(i, node) {
              return 1;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', '*','*','*','*'],
            body: bodyTable,
          },
        },
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 3;
            },
            paddingRight: function(i, node) {
              return 3;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text:`TOTAL TARIFA PAGADA:\t`,
                  bold: true,
                  fontSize: 10,
                  alignment:'right',
                  // alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${totalPago} ${multas[0].comprobante.moneda}.`,
                  bold: true,
                  fontSize: 12,
                  // alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        // {
        //   text: 'NOTES',
        //   style: 'notesTitle',
        // },
        // {
        //   text: 'Some notes goes here \n Notes second line',
        //   style: 'notesText',
        // },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        // columnGap: 20,
        //font: 'Quicksand',
      },
      pageSize:'A5',
      pageOrientation:'landscape',
      pageMargins:[25,25],
    //   pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
    //     return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
    //  },
    
    };
    pdfMake.createPdf(dd).open();
    return true;
  }
  addRowPdf(){
    return []
  }
}
