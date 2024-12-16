import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-tabla-configuraciones',
  templateUrl: './tabla-configuraciones.component.html',
  styles: [`
    .configuracion-container{
      min-height:100px;
      padding: 10px;
    }
    ` ]
})
export class TablaConfiguracionesComponent {


  constructor(public layourService:LayoutService){
  }
  visibleTarifaConsumo:boolean=false;
  visibleTarifaMultaPorRetrasoPago:boolean=false;
  visibleBeneficiarios:boolean=false;
}
