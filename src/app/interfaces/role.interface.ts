
import { Estado } from './atributes.enum';
import { Menu } from './menu.interface';
export interface Role{
    id?:       number;
    nombre?:   string;
    estado?:   Estado;
    menus?:    Menu[];
}
export interface RoleForm{
    id?:       number;
    nombre?:   string;
    estado?:   Estado;
    menus?:    number[];
}