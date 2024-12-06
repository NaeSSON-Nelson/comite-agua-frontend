import { ColumnsAlways } from "./always.interface";
import { Estado } from './atributes.enum';

export interface Menu extends ColumnsAlways{
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  prioridad?:   number;
  itemMenu?:    ItemMenu[];
}
export interface MenuForm {
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  estado?:      Estado;
  itemsMenu?:   ItemToMenu[];
}
export interface ItemMenu extends ColumnsAlways{
  id?:          number;
  linkMenu?:    string;
  estado?:      Estado;
  isActive?:    boolean;
  nombre?:      string;
  visible?:     boolean;
}
export interface ItemToMenu extends ColumnsAlways{
  id?:          number;
  itemMenu?:     ItemMenu;
  
}
