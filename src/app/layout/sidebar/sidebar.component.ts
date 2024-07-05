import { Component, ElementRef, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonAppService } from 'src/app/common/common-app.service';
import { AuthService } from '../../auth/auth.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent {
  @Input()
  model:any[]=[];
  constructor(private readonly authService: AuthService,public layoutService: LayoutService, public el: ElementRef) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.menusUser.subscribe((res) => {
      // console.log(res);
      this.model = res.map((menu) => {
        const menuItem: MenuItem = {
          label: menu.nombre,
          // routerLink: [`/${menu.linkMenu}`],
          items: menu.itemsMenu?.map((item) => {
            const menuItem: MenuItem = {
              label: item.nombre,
              routerLink: [`/${menu.linkMenu}/${item.itemMenu!.linkMenu}`],
              visible:item.visible
            };
            return menuItem;
          }),
        };
        return menuItem;
      });
    });
  }
}
