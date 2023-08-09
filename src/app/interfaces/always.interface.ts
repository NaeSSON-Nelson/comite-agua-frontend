import { Estado } from "./atributes.enum";

export interface ColumnsAlways{
    created_at?: Date;
    updated_at?: Date;
    isActive?: boolean;
    estado?: Estado;
}