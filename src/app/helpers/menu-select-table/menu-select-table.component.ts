import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Menu } from 'src/app/interfaces/menu.interface';
import { HelpersTablesService } from '../helpers-tables.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patternSpanishInline } from 'src/app/patterns/forms-patterns';
import { PaginatorFind } from 'src/app/interfaces/Paginator.interface';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-menu-select-table',
  templateUrl: './menu-select-table.component.html',
  styles: [
  ]
})
export class MenuSelectTableComponent {
  data: Menu[] = [];
  dataSelected: Menu[] = [];
  titleTable:string='Tabla de asignacion de Menus';
  debouncer: Subject<string> = new Subject<string>();
  constructor(
    private readonly helperService: HelpersTablesService,
    private messageService: MessageService,
    private fb:FormBuilder
  ) {}
  private itemsSub!:Subscription;
  private debouncerSub!:Subscription;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.helperService.itemsMenus.subscribe((res) => {
      this.dataPaginator.limit = res.limit;
      this.dataPaginator.offset = res.offset;
      this.dataPaginator.order = res.order;
      this.dataPaginator.size = res.size;
      this.data = res.data;
    });

    this.debouncer.pipe(debounceTime(300)).subscribe((res) => {
      // console.log(res);
      if (res) {
        this.dataPaginator = { q: res, offset: 0, limit: 10 };
      } else {
        this.dataPaginator = { offset: 0, limit: 10 };
      }
      this.findAll();
    });
    this.findAll();
  }
  searchForm: FormGroup = this.fb.group(
    {
      termino: [
        ,
        [Validators.pattern(patternSpanishInline), Validators.minLength(1)],
      ],
    },
    { updateOn: 'change' }
  );

  dataPaginator: PaginatorFind = {
    offset: 0,
    limit: 5,
  };
  findAll() {
    this.helperService.findAllMenus(this.dataPaginator).subscribe({
      next: (res) => {
        if (!res) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn Message',
            detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
            life: 5000,
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warn Message',
          detail: 'OCURRIO UN ERROR AL OBTENER LA DATA',
          life: 5000,
        });
      },
    });
  }
  @Input()
  displayModalTable: boolean = false;

  @Output()
  closeDisplayModalTable: EventEmitter<boolean> = new EventEmitter();
  @Output()
  onDataSelected: EventEmitter<Menu[]> = new EventEmitter();

  selectData() {
    // console.log(this.empleadoSelected);
    // const idsTable= this.dataSelected.map(({id})=>id);
    this.onDataSelected.emit(this.dataSelected);
    // console.log(this.dataSelected);
    this.closeModal();
  }
  closeModal() {
    this.closeDisplayModalTable.emit(false);
  }
  campoValido(nombre: string) {
    return (
      this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.searchForm.controls[nombre].errors &&
      this.searchForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : this.searchForm.controls[nombre].valid &&
        this.searchForm.controls[nombre].touched
      ? 'ng-valid ng-dirty'
      : '';
  }
  limpiarCampo(campo: string) {
    if (
      !this.searchForm.get(campo)?.pristine &&
      this.searchForm.get(campo)?.value?.length === 0
    ) {
      this.searchForm.get(campo)?.reset();
    }
  }
  search($event: any) {
    // console.log($event.target.value);
    this.searchForm.markAllAsTouched();
    if(this.searchForm.invalid) return;

    this.debouncer.next($event.target.value);
  }
  onPageChange($event: PaginatorState) {
    // console.log($event);
    this.dataPaginator.offset = $event.first;
    this.dataPaginator.limit = $event.rows;
    this.findAll();
  }

  getTerminoErrors(campo:string){
    const errors = this.searchForm.get(campo)?.errors;

    if(errors?.['pattern']){
      return 'El buscador contiene caracteres no validos'
    }else if(errors?.['minlength']){
      return 'El tamaño minimo es 1'
    }
    return '';
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.itemsSub) this.itemsSub.unsubscribe();
    if(this.debouncerSub) this.debouncerSub.unsubscribe();
  }
}
