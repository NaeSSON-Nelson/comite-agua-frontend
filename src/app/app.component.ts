import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'
import { LocalStorageService } from './common/storage/local-storage.service';
import { KEY_STORAGE } from './interfaces/storage.enum';
import { IDataUser } from './interfaces/auth.interface';
import { AuthService } from './auth/auth.service';
import { LayoutService } from './layout/layout.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private primeConfig:PrimeNGConfig,
              private readonly storageService:LocalStorageService,
              private readonly authService:AuthService,
              private readonly layoutService:LayoutService,){}
  ngOnInit(): void {
    this.primeConfig.ripple=true;
    const user =this.storageService.getItem<IDataUser>(KEY_STORAGE.DATA_USER)
    
  }
}
