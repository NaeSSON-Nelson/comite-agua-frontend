export interface HttpResponseApi<T>{
    OK: boolean;
    message:    string;
    data?:  T;
}
export interface HttpResponseApiArray<T>{
    OK: boolean;
    message:    string;
    data: DataResult<T>;
}
export interface ResponseResult{
    OK: boolean;
    message:    string;
    statusCode:number;
    error?:  string;
}

export interface DataResult<G>{

    data:G[];
    size:   number;
    offset: number;
    limit:  number;
    order: 'ASC'|'DESC';

}