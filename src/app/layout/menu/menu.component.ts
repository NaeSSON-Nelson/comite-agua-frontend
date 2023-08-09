import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../layout.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent {

  model: any[] = [];

    constructor(public layoutService: LayoutService,private authService:AuthService) { }

    ngOnInit() {
      this.authService.menusUser.subscribe((res) => {
        this.model = res.map((menu) => {
          const menuItem: MenuItem = {
            label: menu.nombre,
            // routerLink: [`/${menu.linkMenu}`],
            items: menu.itemsMenu?.map((item) => {
              const menuItem: MenuItem = {
                label: item.nombre,
                routerLink: [`/${menu.linkMenu}/${item.linkMenu}`],
                visible:item.visible
              };
              return menuItem;
            }),
          };
          return menuItem;
        });
      });
      
        this.model = [
            {
                label: 'Sesion',
                items: [
                    { label: 'Iniciar Sesion', icon: 'pi pi-user', routerLink: ['/auth/login'],visible:true }
                ]
            }
        ];
    }
}
