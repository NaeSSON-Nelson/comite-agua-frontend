import { Component, Input } from '@angular/core';
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

    @Input()
    model: any[] = [];

    constructor(public layoutService: LayoutService,private authService:AuthService) { }

    ngOnInit() {
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
