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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  buttonSign = 'Ingresar';

  msgs: Message[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  loginForm: FormGroup = this.fb.group({
    userName: [
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
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Logueado con exito',
          detail: `Bienvenido`,
          icon: 'pi pi-check',
          life: 2000,
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.msgs=[];
        this.msgs.push({
          severity: 'warn',
          summary: 'Warn Message',
          detail: 'Credenciales invalidas',
        });
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
}
