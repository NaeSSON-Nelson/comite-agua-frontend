import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsociacionesService } from '../asociaciones.service';
import { MessageService } from 'primeng/api';
import { PaginatorFind } from 'src/app/interfaces';
import { HistorialConexiones } from 'src/app/interfaces/medidor.interface';

@Component({
  selector: 'app-historial-cortes',
  templateUrl: './historial-cortes.component.html',
  styles: [
  ]
})
export class HistorialCortesComponent {

  @Input()
  visible:boolean=false;
  @Input()
  idAsociacion:number=-1;
  @Output()
  eventVisible:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly asociacionesService:AsociacionesService,
              private messageService:MessageService,
  ){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.asociacionesService.historialCortes.subscribe(res=>{
      this.dataPaginator.limit=res.limit;
      this.dataPaginator.offset=res.offset;
      this.dataPaginator.order=res.order;
      this.dataPaginator.size=res.size;
      this.data = res.data;
        if(this.data.length==0)
            this.titleEstado='* NO TIENE NINGUNA ACCIÓN REALIZADA SOBRE EL MEDIDOR DE AGUA ASOCIADO';
          else this.titleEstado='';
    })
  }
  data:HistorialConexiones[]=[];
  dataPaginator: PaginatorFind = {
    offset:0,
    limit:10,
  };
  titleEstado='';
  obtenerHistorialCortes(){
    if(this.idAsociacion>0){
      this.asociacionesService.obtenerHistorialCortes(this.idAsociacion,this.dataPaginator).subscribe(res=>{
        if(res.OK){
        }
      });
    }
  }
  loadCustomers(filters:any){

    // console.log('customers',filters);
    // if(this.searchForm.invalid) return;
    // console.log('customers',filters);
    // if(filters.sortField){
    //   this.dataPaginator.sort=filters.sortField;
    //   this.dataPaginator.order= filters.sortOrder===1 ?'ASC': 'DESC';
    // }
    this.dataPaginator.offset=filters.first
    this.dataPaginator.limit=filters.rows
    // if(filters.globalFilter){
    //   if(filters.globalFilter.value.length===0)
    //   delete this.dataPaginator.q
    //   else this.dataPaginator.q = filters.globalFilter.value
    // }
    this.obtenerHistorialCortes();
  }
}
