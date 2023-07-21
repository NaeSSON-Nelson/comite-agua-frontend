export interface HttpResponseApi<T>{
    OK: boolean;
    msg:    string;
    data?:  T;
}
export interface HttpResponseApiArray<T>{
    OK: boolean;
    msg:    string;
    data: DataResult<T>;
}

export interface DataResult<G>{

    data:G[];
    size:   number;
    offset: number;
    limit:  number;
    order: 'ASC'|'DESC';

}