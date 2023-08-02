import { NgModule } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { ScrollerModule } from 'primeng/scroller';
import { CheckboxModule} from 'primeng/checkbox'
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule} from 'primeng/multiselect'
@NgModule({
  imports: [
  
    DialogModule,
    TableModule,
    ButtonModule,
    SliderModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    PasswordModule,
    KeyFilterModule,
    InputNumberModule,
    PaginatorModule,
    DividerModule,
    InputMaskModule,
    ListboxModule,
    ScrollerModule,
    ScrollerModule,
    CheckboxModule,
    SelectButtonModule,
    MultiSelectModule,
  ],
  exports:[
    
    DialogModule,
    TableModule,
    ButtonModule,
    SliderModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    PasswordModule,
    KeyFilterModule,
    InputNumberModule,
    PaginatorModule,
    DividerModule,
    InputMaskModule,
    ListboxModule,
    ScrollerModule,
    CheckboxModule,
    SelectButtonModule,
    MultiSelectModule,
  ]
})
export class PrimeNgCrudModule { }
