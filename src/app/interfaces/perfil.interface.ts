import { Afiliado, AfiliadoForm } from "./afiliado.interface";
import { Estado, Genero, TipoPerfil } from './atributes.enum';
import { Usuario, UsuarioForm } from "./usuario.interface";

export interface Perfil{
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
    usuario?        :Usuario
    afiliado?       :Afiliado
    estado?         :Estado
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
    tipoPerfil?     :TipoPerfil[]
    direccion?      :string;
    accessAcount?   :boolean;
    estado?         :Estado
    usuarioForm?        :UsuarioForm
    afiliadoForm?       :AfiliadoForm
}

