import { Usuario } from "./usuario.interface";

export interface AuthResponse{
    OK:      boolean;
	dataUser: IDataUser;
    message:     string;
}
export interface IDataUser{
    accessToken: string;
	refreshToken: string;
	id: string; 
}
export interface IResponseSingIn {
	id: string;
	accessToken: string;
	refreshToken: string;
}

export interface IResponseRefreshToken {
	accessToken: string;
	refreshToken: string;
}

export interface IResponseUser {
	id: number;
	username: string;
	password: string;
}
