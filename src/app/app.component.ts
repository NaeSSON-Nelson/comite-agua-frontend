import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LocalStorageService } from './common/storage/local-storage.service';
import { KEY_STORAGE } from './interfaces/storage.enum';
import { IDataUser } from './interfaces/auth.interface';
import { AuthService } from './auth/auth.service';
import { LayoutService } from './layout/layout.service';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls:['./app.component.css']
})
export class AppComponent {
  constructor(
    private readonly storageService: LocalStorageService,
    private readonly authService: AuthService,
    private readonly layoutService: LayoutService,
    private readonly appService: AppService
  ) {}
  ngOnInit() {
  }
}
