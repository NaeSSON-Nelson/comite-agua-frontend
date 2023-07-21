import { Estado } from "./afiliado.interface";

export interface Menu {
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  estado?:      Estado;
  itemsMenu?:    ItemMenu[];
}
export interface MenuForm {
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  estado?:      Estado;
  itemsMenu?:    number[];
}
export interface ItemMenu {
  id?:          number;
  nombre?:      string;
  linkMenu?:    string;
  estado?:      Estado;
}
