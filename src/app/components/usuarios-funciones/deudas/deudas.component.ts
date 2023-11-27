import { Component } from '@angular/core';
import { UsuarioFuncionesService } from '../usuario-funciones.service';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.component.html',
  styles: [
  ]
})
export class DeudasComponent {

  constructor(private usuarioFunciones:UsuarioFuncionesService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
}
