import { Injectable } from '@angular/core';
import { Barrio, Estado, Genero, TipoPerfil } from '../interfaces';


export interface Values<T>{
  name:   string;
  value:  T;
}
@Injectable({
  providedIn: 'root'
})
export class CommonAppService {

  
  private _estados:Values<Estado>[]=[
    {name:'ACTIVO',value:Estado.ACTIVO},
    {name:'INACTIVO',value:Estado.INACTIVO},
    {name:'PROCESO',value:Estado.PROCESO},
    {name:'SUSPENDIDO',value:Estado.SUSPENDIDO},
  ]
  private _generos:Values<Genero>[]=[
    {name:'MASCULINO',value:Genero.MASCULINO},
    {name:'FEMENINO',value:Genero.FEMENINO},
  ]
  private _barrios:Values<Barrio>[]=[
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
  get estados(){
    return [...this._estados];
  }
  get generos(){
    return [...this._generos];
  }
  get barrios(){
    return [...this._barrios];
  }
  get tipoPerfiles(){
    return [...this._tipoPerfil];
  }
}
