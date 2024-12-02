import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from '../../auth/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Role } from 'src/app/interfaces';
import { Dropdown } from 'primeng/dropdown';
import { Observable, Subject } from 'rxjs';
import { RolesSelect } from 'src/app/interfaces/role.interface';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styles: [`
  .menu-taps{
    width: 100%
  }
  `],
})
export class TopbarComponent {
  
  usuario: Usuario|null=null;
  // items: MenuItem[]=[];
  _menusRolObserver$:Subject<MenuItem>;
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
  ) {
    this._menusRolObserver$ = new Subject<MenuItem>()
  }
  // get  menusRol(){
  //   return this._menusRolObserver$.asObservable();
  // }
  roles:RolesSelect[]=[];
  
  @Output()
  userLevelEmit:EventEmitter<number> = new EventEmitter<number>();
  rolChange(event:any){
    
    console.log('rol cambiado',event.value);
    
    const items:MenuItem[]=event.value.map((menu:any)=>{
      const itemMenu:MenuItem={
        label:menu.nombre,
        items:menu.itemMenu.map((item:any)=>{
          const itm:MenuItem={
            label:item.nombre,
            routerLink:[`${menu.linkMenu}/${item.linkMenu}`],
            visible:item.visible
          }
          return itm;
        }
      )
      }
      return itemMenu;
    })
    this.layoutService.menusRolObserver.next(items);
  }
  menusUser(idRol:number){
    return this.usuario?.roles?.find(rol=>rol.id === idRol);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log('usuario en top bar',this.usuario);
    this.layoutService.user.subscribe(res=>{
      console.log('respuesta desde top bar',res);
      if(res){
        this.usuario=res;
        // this.menusUser(res.roles![0].id!);
        // if(res!.roles![0].nivel!<=40){
        //   this.getMenus();
        // }
        this.cargarRoles();
      }else{
        this.usuario=null;
      }
      
    })
    
  }
  cargarRoles(){
    if(this.usuario){
      this.roles = this.usuario.roles!.map(rol=>{
        const selectes:RolesSelect={
          label:rol.nombre!,
          value:rol.menus
        }
        return selectes
      })
    }
    this.cargarMenusPrimerRol();
  }
  cargarMenusPrimerRol(){
    const items:MenuItem[]=this.roles[0].value.map((menu:any)=>{
      const itemMenu:MenuItem={
        label:menu.nombre,
        items:menu.itemMenu.map((item:any)=>{
          const itm:MenuItem={
            label:item.nombre,
            routerLink:[`${menu.linkMenu}/${item.linkMenu}`],
            visible:item.visible
          }
          return itm;
        }
      )
      }
      return itemMenu;
    })
    this.layoutService.menusRolObserver.next(items);
  }
  // getMenus(){

  //   this.authService.menusUser.subscribe((res) => {
  //     // console.log('TAP TAP MENU',res);

  //     this.items = res.map((menu) => {
  //       const menuItem: MenuItem = {
  //         label: menu.nombre,
  //         // routerLink: [`/${menu.linkMenu}`],
  //         items: menu.itemMenu?.map((item) => {
  //           const menuItem: MenuItem = {
  //             label: item.nombre,
  //             routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
  //             visible:item.visible
  //           };
  //           return menuItem;
  //         }),
  //       };
  //       return menuItem;
  //     });
  //   });
  // }
}
