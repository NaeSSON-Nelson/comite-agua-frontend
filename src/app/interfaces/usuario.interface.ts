import { Estado } from './atributes.enum';
import { Role } from './role.interface';

export interface Usuario{
    id?:     number;
    username?:   string;
    password?:   string;
    roles?:      Role[];
    correo?:      string;
    correoVerify?:boolean;
    isActive?:   boolean;
    estado?:     Estado;

}
export interface UsuarioForm{
    id?:     number;
    estado?:     Estado;
    roles?:      number[];
}
