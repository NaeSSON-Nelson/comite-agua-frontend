import { Afiliado, Estado } from "./afiliado.interface";
import { Role } from './role.interface';

export interface Usuario{
    id?:     number;
    userName?:   string;
    password?:   string;
    estado?:     Estado;
    afiliado?:   Afiliado;
    roles?:      Role[];
    perfil?:     Perfil;
}
export interface UsuarioCreateResponse{
    usuario:        Usuario;
    realPassword:   string;
    msg?:           string;
}
export interface UsuarioForm{
    id?:     number;
    userName?:   string;
    password?:   string;
    estado?:     Estado;
    afiliado?:   Afiliado;
    roles?:      number[];
    perfil?:     Perfil;
}

export interface Perfil{
    id?:    number;
    nombreUsuario?: string;
    correo?:        string;
    codigoPostal?:  string;
    contactos?:     string[];
    profileImage?:  string;
    direccion?:     string;
    estado?:        Estado;
    longitud?:      string;
    latitud?:       string;
}