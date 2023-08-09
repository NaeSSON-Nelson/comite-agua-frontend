import { Component, ElementRef } from '@angular/core';
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
  constructor(private readonly authService: AuthService,public layoutService: LayoutService, public el: ElementRef) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
}
