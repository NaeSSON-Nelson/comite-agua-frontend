import { Afiliado, AfiliadoForm } from "./afiliado.interface";
import { ColumnsAlways } from "./always.interface";
import { Estado, Genero, TipoPerfil } from './atributes.enum';
import { Usuario, UsuarioForm } from "./usuario.interface";

export interface Perfil extends ColumnsAlways{
    id?             :number;
    nombrePrimero?  :string;
    nombreSegundo?  :string;
    apellidoPrimero?:string;
    apellidoSegundo?:string;
    CI?             :string;
    genero?         :Genero;
    profesion?      :string;
    fechaNacimiento?:Date;
    tipoPerfil?     :TipoPerfil[]
    direccion?      :string;
    accessAcount?   :boolean;
    contactos?       :string[];
    usuario?        :Usuario;
    afiliado?       :Afiliado;
}
export interface PerfilForm{
    
    id?             :number;
    nombrePrimero?  :string;
    nombreSegundo?  :string;
    apellidoPrimero?:string;
    apellidoSegundo?:string;
    CI?             :string;
    genero?         :Genero;
    profesion?      :string;
    fechaNacimiento?:Date;
    direccion?      :string;
    contactos?      :string[];
    estado?         :Estado;
    usuarioForm?    :UsuarioForm;
    afiliadoForm?   :AfiliadoForm;
}

