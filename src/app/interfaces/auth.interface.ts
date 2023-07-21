import { Usuario } from "./usuario.interface";

export interface AuthResponse{
    ok:      boolean;
    token?:   string;
    msg?:     string;
    usuario:    Usuario;
}