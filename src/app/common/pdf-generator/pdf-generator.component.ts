import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styles: [
  ]
})
export class PdfGeneratorComponent<T> {

  @Input()
  comprobantePorPagar:boolean=false;
  @Input()
  comprobantePagado:boolean=false;
  @Input()
  data!:T;
  constructor(){

  }

  generatePdf(){
    if(this.comprobantePorPagar){

    }else if(this.comprobantePagado){

    }else{
      console.info(`its not selected option generated`)
    }
  }
  generarCmPorPagar(){

  }
}
