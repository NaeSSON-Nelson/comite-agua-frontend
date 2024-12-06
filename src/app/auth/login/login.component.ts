import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Message, MessageService } from 'primeng/api';
import {
  patternSpanishInline,
  patternText,
} from '../../patterns/forms-patterns';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/common/storage/local-storage.service';
import { KEY_STORAGE } from 'src/app/interfaces/storage.enum';
import { LayoutService } from 'src/app/layout/layout.service';
import { PATH_DASHBOARD, ValidMenu } from 'src/app/interfaces/routes-app';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  buttonSign = 'Ingresar';

  msgs: Message[] = [];
  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly localStorageService:LocalStorageService,
    private readonly layoutService:LayoutService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.layoutService.state.staticMenuDesktopInactive=true;
  }
  loginForm: FormGroup = this.fb.group({
    username: [
      ,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(patternSpanishInline),
      ],
    ],
    password: [
      ,
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(patternText),
      ],
    ],
  });
  validForm() {
    // console.log(this.loginForm.value);
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.signUp(this.loginForm.value);
  }
  signUp(form: Usuario) {
    
    this.authService.login(form).subscribe((res) => {
      // console.log('log',res);
        if(res.OK){
          this.localStorageService.setItem(KEY_STORAGE.DATA_USER,res.dataUser);
          this.getUser();
          this.router.navigateByUrl(`${ValidMenu.consultar}/${PATH_DASHBOARD}`);
   
        }
      
    });
  }
  limpiarCampo(campo: string) {
    if (
      !this.loginForm.get(campo)?.pristine &&
      this.loginForm.get(campo)?.value?.length === 0
    ) {
      this.loginForm.get(campo)?.reset();
    }
  }
  campoValido(nombre: string) {
    return (
      this.loginForm.controls[nombre].errors &&
      this.loginForm.controls[nombre].touched
    );
  }
  inputValid(nombre: string) {
    return this.loginForm.controls[nombre].errors &&
      this.loginForm.controls[nombre].touched
      ? 'ng-invalid ng-dirty'
      : '';
  }
  getUsernameErrors(campo: string) {
    const errors = this.loginForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 3 como minimo';
    }
    return '';
  }
  getPasswordErrors(campo: string) {
    const errors = this.loginForm.get(campo)?.errors;

    if (errors?.['required']) {
      return 'El campo es requerido';
    } else if (errors?.['pattern']) {
      return 'El campo contiene caracteres invalidos';
    } else if (errors?.['minlength']) {
      return 'El tamaño del campo debe ser 6 como minimo';
    }
    return '';
  }
  getUser(){
    this.authService.getUser().subscribe(res=>{
      console.log('es get user',res);
      this.layoutService.userObserver.emit(res.data!);
      // this.authService.usuarioState=res.data|| null;
    })
  }
}
