import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {  PasswordModule} from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule} from 'primeng/button';
import { MessagesModule} from 'primeng/messages';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    PasswordModule,
    MessagesModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class AuthModule { }
