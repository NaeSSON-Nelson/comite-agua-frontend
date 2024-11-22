import { Component, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../interfaces';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './layout.service';
import { LocalStorageService } from '../common/storage/local-storage.service';
import { KEY_STORAGE } from '../interfaces/storage.enum';
import { IDataUser } from '../interfaces/auth.interface';
import { filter, Subscription } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
    .layout-main-container-left {
      margin-left: 300px;
    }`
  ]
})
export class LayoutComponent {

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

  @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;



  usuario:Usuario|null=null;
  userLevel:number=0;
  roles:any[]=[];
  constructor(private authService:AuthService,
              public readonly layoutService:LayoutService,
              private readonly localStorageService:LocalStorageService,
              public renderer: Renderer2, public router: Router
            ){
              this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
                if (!this.menuOutsideClickListener) {
                    this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                        const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target) 
                            || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
                        
                        if (isOutsideClicked) {
                            this.hideMenu();
                        }
                    });
                }
    
                if (!this.profileMenuOutsideClickListener) {
                    this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                        const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                            || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));
    
                        if (isOutsideClicked) {
                            this.hideProfileMenu();
                        }
                    });
                }
    
                if (this.layoutService.state.staticMenuMobileActive) {
                    this.blockBodyScroll();
                }
            });
    
            this.router.events.pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.hideMenu();
                    this.hideProfileMenu();
                });
  }
  ngOnInit(): void {
    // this.authService.usuario.subscribe((res) => {
    //   console.log('respuesta desde usuario RXJS',res);
    //   console.log('respuesta:',res);
    // });
    // this.authService.usuarioLog.subscribe(res=>{
    //   console.log('RESPUESTA DESDE LISTENER',res);
    // })
    this.layoutService.user.subscribe(res=>{
      // console.log('hay usurio layout: 3');
      console.log(res);
      this.usuario=res;
      if(res){
        this.roles=res.roles!.map(rol=>{
          return{name:rol.nombre,value:{id:rol.id,nivel:rol.nivel}};
        })
        this.userLevel = this.roles[0].value.nivel;
      }else{
        console.log('no usuario');
      }
    })
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
        this.menuOutsideClickListener();
        this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
}

hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener();
        this.profileMenuOutsideClickListener = null;
    }
}

blockBodyScroll(): void {
    if (document.body.classList) {
        document.body.classList.add('blocked-scroll');
    }
    else {
        document.body.className += ' blocked-scroll';
    }
}

unblockBodyScroll(): void {
    if (document.body.classList) {
        document.body.classList.remove('blocked-scroll');
    }
    else {
        document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
            'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}
  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'overlay',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple
    }
    // return this.usuario?'layout-static':'layout-overlay';
  }
  typeRoleSelected(){
      
  }
  
  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    // console.log('PAPITAS');
    const user =this.localStorageService.getItem<IDataUser>(KEY_STORAGE.DATA_USER);
    if(user)
    this.authService.getUser().subscribe(res=>{
      // console.log('suscrito',res);
      
      this.layoutService.userObserver.emit(res.data!)
    })
  }
  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
        this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
        this.menuOutsideClickListener();
    }
}
}
