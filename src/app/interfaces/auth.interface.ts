import { Usuario } from "./usuario.interface";

export interface AuthResponse{
    OK:      boolean;
    token?:   string;
    message?:     string;
    usuario:    Usuario;
}