export interface PaginatorFind{
    q?:      string,
    estado?: number,
    order?:  'ASC'|'DESC',
    limit?:  number,
    offset?: number,
    size?:  number;
}