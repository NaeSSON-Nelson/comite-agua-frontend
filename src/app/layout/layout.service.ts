import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../interfaces';
import { AuthService } from '../auth/auth.service';
import { MenuItem } from 'primeng/api';

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
  private _user$: EventEmitter<Usuario | null> = new EventEmitter<Usuario | null>();
  private _menusRol$: EventEmitter<MenuItem[]> = new EventEmitter<MenuItem[]>();
  get user() {
    return this._user$.asObservable();
  }
  get userObserver() {
    return this._user$;
  }
  get menusRol() {
    return this._menusRol$.asObservable();
  }
  get menusRolObserver() {
    return this._menusRol$;
  }
    
  
  config: AppConfig = {
    ripple: true,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 18,
};

state: LayoutState = { 
    staticMenuDesktopInactive: true,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
};

private configUpdate = new Subject<AppConfig>();

private overlayOpen = new Subject<any>();

configUpdate$ = this.configUpdate.asObservable();

overlayOpen$ = this.overlayOpen.asObservable();

onMenuToggle() {
  if(this.isOverlay()) {
    this.state.overlayMenuActive = !this.state.overlayMenuActive;
    if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
    }
  }

  if(this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
  }
  else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
          this.overlayOpen.next(null);
      }
  }
}

showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
        this.overlayOpen.next(null);
    }
}

showConfigSidebar() {
    this.state.configSidebarVisible = true;
}

isOverlay() {
    return this.config.menuMode === 'overlay';
}

isDesktop() {
    return window.innerWidth > 991;
}

isMobile() {
    return !this.isDesktop();
}

onConfigUpdate() {
    this.configUpdate.next(this.config);
}
}
