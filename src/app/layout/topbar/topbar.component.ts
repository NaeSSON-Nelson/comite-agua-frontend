import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from '../../auth/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Role } from 'src/app/interfaces';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styles: [],
})
export class TopbarComponent {
  @Input()
  usuario: Usuario|null=null;
  items: MenuItem[]=[];
  itemsUser:MenuItem[]=[
    {label:'Panel de usuario', routerLink:'/user/perfil'},
    {label:'Cerrar sesion',command:(event)=>{
      this.authService.logout()
      this.router.navigate(['']);
    }}
  ];
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService,
    
    private router: Router,
  ) {}
  @Input()
  roles:any[]=[];
  @Input()
  userLevel:number=0;
  @Output()
  userLevelEmit:EventEmitter<number> = new EventEmitter<number>();
  rolChange(event:any){
    console.log('rol cambiado',event.value);
    this.menusUser(event.value.id);
    this.userLevel = event.value.nivel;
    this.userLevelEmit.emit(event.value.nivel)
  }
  menusUser(idRol:number){
    this.authService.getMenusUser(idRol).subscribe(res=>{
      console.log(res);
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.usuario.subscribe(res=>{
      console.log('respuesta desde top bar',res);
      if(res){
        this.menusUser(res.roles![0].id!);
      }
    })
  }
}
