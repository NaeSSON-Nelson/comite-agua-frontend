import { Injectable } from '@angular/core';
import { Barrio, Estado, Genero, TipoPerfil } from '../interfaces';
import { Nivel } from '../interfaces/atributes.enum';


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
    return [...this._barriosForm]
  }
  get tipoPerfiles(){
    return [...this._tipoPerfil];
  }
  get niveles(){
    return [...this._nivelesRoles]
  }
}
