import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {  ResponseCreatePerfil } from 'src/app/interfaces';

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
    this.router.navigate(['perfiles']);
  }
  // @Output()
  // emitOperation:EventEmitter<EditData>= new EventEmitter();
  // operation(tipo:EditData){
  //   this.emitOperation.emit(tipo)
  // }
}
