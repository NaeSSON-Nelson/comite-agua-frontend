import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosServicioComponent } from './pagos-servicio/pagos-servicio.component';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ListaDeudoresComponent } from './lista-deudores/lista-deudores.component'
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    PagosServicioComponent,
    ListaDeudoresComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    TableModule,
    ToolbarModule,
    SplitButtonModule,
    DropdownModule,
  ]
})
export class ReportesModule { }
