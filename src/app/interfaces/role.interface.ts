
import { ColumnsAlways } from './always.interface';
import { Estado, Nivel } from './atributes.enum';
import { Menu } from './menu.interface';
export interface Role extends ColumnsAlways{
    id?:       number;
    nombre?:   string;
    nivel?:    Nivel;
    menus?:    Menu[];
}
export interface RoleForm{
    id?:       number;
    nombre?:   string;
    nivel?:    Nivel;
    estado?:   Estado;
    menus?:    number[];
}