import { Injectable } from '@angular/core';
import { Barrio, Estado, Genero, MesLectura, Perfil, TipoPerfil } from '../interfaces';
import { Medicion, Nivel } from '../interfaces/atributes.enum';
import * as IPdf from 'pdfmake/interfaces'
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
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
    {name:'TODOS',value:null},
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
  get estados(){
    return [...this._estados];
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
  constructor(){}
  comprobantesPdfGenerated(lecturas:MesLectura[],afiliado:Perfil){
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
  

  addRowPdf(){
    return []
  }
}
