import { Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private primengConfig: PrimeNGConfig,
    
  ) { 
    
    this.primengConfig.ripple=true;
    this.configureLocalization();
  }

  configureLocalization() {
    this.primengConfig.setTranslation({
      // Configuración para Calendar
      firstDayOfWeek:1,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dateFormat:'dd/mm/yy',
      // Configuración para FileUpload
      choose: 'Elegir',
      upload: 'Subir',
      cancel: 'Cancelar',
      
      // Configuración para Filters
      startsWith: 'Comienza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No igual',
      
      // Otras traducciones generales
      today: 'Hoy',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincidir todos',
      matchAny: 'Coincidir cualquiera'
    });
  }
}
