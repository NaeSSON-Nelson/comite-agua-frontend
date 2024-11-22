export interface PaginatorFind{
    q?:      string,
    estado?: number,
    order?:  'ASC'|'DESC',
    sort?:   string;
    limit?:  number,
    offset?: number,
    size?:  number;
}
export interface QueryExportPerfil{
    id:'true'|'false';
    nombrePrimero:'true'|'false';
    nombreSegundo:'true'|'false';
    apellidoPrimero:'true'|'false';
    apellidoSegundo:'true'|'false';
    CI:'true'|'false';
    genero:'true'|'false';
    profesion:'true'|'false';
    fechaNacimiento:'true'|'false';
    tipoPerfil:'true'|'false';
    direccion:'true'|'false';
    contacto:'true'|'false';
    afiliado?:'true'|'false';
    isActive?:'true'|'false';
    isAfiliado?:'true'|'false';
    order?: 'ASC' | 'DESC'; //EL ORDEN QUE VENDRAN
    sort?:'id'| 'nombrePrimero'|'apellidoPrimero'|'CI'|'genero'|'fechaNacimiento'; // POR EL TIPO DE CAMPO A ORDENAR
    [key: string]: any;
}