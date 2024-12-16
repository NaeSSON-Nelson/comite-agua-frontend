import { ColumnsAlways } from './always.interface';
import { Estado } from './atributes.enum';
import { Perfil } from './perfil.interface';
import { Role } from './role.interface';

export interface Usuario extends ColumnsAlways{
    id?:     number;
    username?:   string;
    password?:   string;
    roles?:      Role[];
    correo?:      string;
    correoVerify?:boolean;
    perfil?         :Perfil;
}
export interface UsuarioForm{
    id?:     number;
    estado?:     Estado;
    correo?:    string;
    roles?:      number[];
}
