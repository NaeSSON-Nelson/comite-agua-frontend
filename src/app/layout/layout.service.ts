import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../interfaces';
import { AuthService } from '../auth/auth.service';

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}
export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };
  config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'overlay',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  };
  private overlayOpen = new Subject<any>();
  // private _user$:Subject<Usuario> = new Subject<Usuario>()
  private _user$:EventEmitter<Usuario | null> = new EventEmitter<Usuario | null>();
  overLayOpen$ = this.overlayOpen.asObservable();
  constructor() {
    // this.userObserver.
  }
  get user(){
    return this._user$.asObservable();
  }
  get userObserver(){
    return this._user$;
  }
  
  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }
  isDesktop() {
    return window.innerWidth > 991;
  }
  isOverlay() {
    return this.config.menuMode === 'overlay';
  }
}
