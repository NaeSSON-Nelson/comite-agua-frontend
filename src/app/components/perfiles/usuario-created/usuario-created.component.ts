import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {  ResponseCreatePerfil } from 'src/app/interfaces';
import { PATH_PERFILES } from 'src/app/interfaces/routes-app';

@Component({
  selector: 'app-usuario-created',
  templateUrl: './usuario-created.component.html',
  styles: [
  ]
})
export class UsuarioCreatedComponent {

  @Input()
  displayModal:boolean = false;

  @Output()
  onCloseDetalles:EventEmitter<boolean> = new EventEmitter();

  @Input()
  dataSelected!:ResponseCreatePerfil;
  constructor( private readonly router:Router) { }

  ngOnInit(): void {
  }
  closeModal(){
    
    this.onCloseDetalles.emit(false);
    this.router.navigate([PATH_PERFILES]);
  }
  // @Output()
  // emitOperation:EventEmitter<EditData>= new EventEmitter();
  // operation(tipo:EditData){
  //   this.emitOperation.emit(tipo)
  // }
}
