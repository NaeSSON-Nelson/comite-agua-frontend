import { ColumnsAlways } from "./always.interface";
import { Estado } from "./atributes.enum";

export interface Menu extends ColumnsAlways{
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  itemsMenu?:    ItemToMenu[];
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
}
export interface ItemToMenu extends ColumnsAlways{
  id?:          number;
  nombre?:      string;
  visible?:     boolean;
  itemMenu?:     ItemMenu;
  
}
