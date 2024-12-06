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
import { ItemMenu, Menu } from '../../interfaces/menu.interface';
import { PATH_DASHBOARD, PRIORITY, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';

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
    const menus:MenuItem[] =[
      {
        label:'Panel',
        items:[{
          label:'INICIO',
          routerLink:[`${ValidMenu.consultar}/${PATH_DASHBOARD}`],
          icon:'pi pi-home',
          visible:true
        }]
      },
      ...this.clasificarMenus(event.value),
    ];
    // const items:MenuItem[]=event.value.map((menu:any)=>{
    //   console.log('visibles',visibles);
    //   if(visibles.length>1){
    //     const itemMenu:MenuItem={
    //       label:menu.nombre,
    //       items:menu.itemMenu.map((item:any)=>{
    //         const itm:MenuItem={
    //           label:item.nombre,
    //           routerLink:[`${menu.linkMenu}/${item.linkMenu}`],
    //           visible:item.visible
    //         }
    //         return itm;
    //       }
    //     )
    //   }
    //   return itemMenu;
    // }else{
    //   const itemMenu:MenuItem={
    //     label:menu.nombre,
    //     routerLink:[`${menu.linkMenu}/${visibles[0].linkMenu}`],
    //     visible:visibles[0].visible
    //     }
    //     return itemMenu;
    //   }
    // })
    this.layoutService.menusRolObserver.next(menus);
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
    const menus:MenuItem[] =[
      {
        label:'Panel',
        items:[{
          label:'Inicio',
          routerLink:[`${ValidMenu.consultar}/${PATH_DASHBOARD}`],
          icon:'pi pi-home',
          visible:true
        }]
      },
      
      ...this.clasificarMenus(this.roles[0].value),
    ];
    // const items:MenuItem[]=this.roles[0].value.map((menu:any)=>{
    //   const itemMenu:MenuItem={
    //     label:menu.nombre,
    //     items:menu.itemMenu.map((item:any)=>{
    //       const itm:MenuItem={
    //         label:item.nombre,
    //         routerLink:[`${menu.linkMenu}/${item.linkMenu}`],
    //         visible:item.visible
    //       }
    //       return itm;
    //     }
    //   )
    //   }
    //   return itemMenu;
    // })
    this.layoutService.menusRolObserver.next(menus);
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

  clasificarMenus(menus:Menu[]){
    const menusAdds:MenuItem[]=[];
    const menusAfiliado:MenuItem=
      {
        label:'AFILIADO',
        items:[],
        icon:'pi pi-user'
      }
    ;
    const menusAdministrativo:MenuItem=
      {
        label:'ADMINISTRATIVOS',
        icon:'pi pi-building',
        items:[]
      };
      console.log('LOS MENUS',menus);
    for(const menu of menus){
      const visibles = menu.itemMenu!.filter(item=>item.visible);
      if(menu.prioridad!<=PRIORITY.afiliado){
        for(const item of visibles){
          if(item.linkMenu === ValidItemMenu.consultarConsultarMedidoresAgua)
          menusAfiliado.items?.push({
            label:item.nombre,
            routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
            icon:'pi pi-book',
            visible:item.visible
          })
          else if(item.linkMenu === ValidItemMenu.consultarDeudas){
            menusAfiliado.items?.push({
              label:item.nombre,
              routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
              icon:'pi pi-id-card',
              visible:item.visible
            })
            
          }else{
            menusAfiliado.items?.push({
              label:item.nombre,
              routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
              visible:item.visible
            })

          }
        }
      }else if(menu.prioridad! <= PRIORITY.administrativo){
        for(const item of visibles){
          if(visibles.length===1){
            menusAdministrativo.items!.push({
              label:menu.nombre,
              routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
              icon: menu.linkMenu ===ValidMenu.asociaciones?'pi pi-folder'
              :menu.linkMenu === ValidMenu.cobros?'pi pi-money-bill'
              :menu.linkMenu === ValidMenu.lecturas?'pi pi-table'
              :menu.linkMenu === ValidMenu.medidores?'pi pi-mobile'
              :menu.linkMenu === ValidMenu.perfiles?'pi pi-users'
              :menu.linkMenu === ValidMenu.roles?'pi pi-shield'
              :menu.linkMenu === ValidMenu.reportes?'pi pi-book'
              :'',
              visible:item.visible
            })
          }else{
            menusAdministrativo.items!.push({
              label:item.nombre,
              routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
              icon: menu.linkMenu ===ValidMenu.asociaciones?'pi pi-folder'
              :menu.linkMenu === ValidMenu.cobros?'pi pi-money-bill'
              :menu.linkMenu === ValidMenu.lecturas?'pi pi-table'
              :menu.linkMenu === ValidMenu.medidores?'pi pi-mobile'
              :menu.linkMenu === ValidMenu.perfiles?'pi pi-users'
              :menu.linkMenu === ValidMenu.roles?'pi pi-shield'
              :menu.linkMenu === ValidMenu.reportes?'pi pi-book'
              :'',
              visible:item.visible
            })
          }
          
        }
      }
    }
    if(menusAfiliado.items!.length>0) menusAdds.push(menusAfiliado);
    if(menusAdministrativo.items!.length>0) menusAdds.push(menusAdministrativo);
    return menusAdds;
  }
  reorganizarMenus(menus:Menu[]){

  }
}
