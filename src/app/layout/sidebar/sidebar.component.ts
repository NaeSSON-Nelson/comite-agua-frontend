import { Component, ElementRef, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent {
  @Input()
  model:MenuItem[]=[];
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
  ngOnInit(): void {
    this.layoutService.menusRol.subscribe(res=>{
      console.log('menus desde side bar',res);
      this.model=res;
      this.layoutService.state.staticMenuDesktopInactive=false;
    })
  }
}
