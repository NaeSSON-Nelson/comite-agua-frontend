import { ColumnsAlways } from "./always.interface";
import { Estado } from "./atributes.enum";

export interface Menu extends ColumnsAlways{
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  itemsMenu?:    ItemMenu[];
}
export interface MenuForm {
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  estado?:      Estado;
  itemsMenu?:    number[];
}
export interface ItemMenu extends ColumnsAlways{
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  visible?:     boolean;
}
