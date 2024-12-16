export enum Genero{
    MASCULINO='MASCULINO',
    FEMENINO='FEMENINO'
}
export enum Barrio {
    mendezFortaleza = 'MENDEZ FORTALEZA',
    _20DeMarzo =      '20 DE MARZO',
    sanAntonio =      'SAN ANTONIO',
    verdeOlivo =      'VERDE OLIVO',
    primavera =       'PRIMAVERA',
}
export enum Estado{
    ACTIVO='ACTIVO',
    INACTIVO='INACTIVO',
    DESHABILITADO = 'DESHABILITADO'
    // SUSPENDIDO='SUSPENDIDO',
    // PROCESO='EN PROCESAMIENTO'
}

export enum TipoPerfil{
    ADMINISTRATIVO='ADMINISTRATIVO',
    AFILIADO='AFILIADO'
}
export enum Nivel{
    afiliado=10,
    contador=30,
    administrativo=50,
}
export enum Monedas{
    Bs ="Bs"
}
export enum Medicion{
    ft3 = "ft3",
    mt3 = 'mt3',
}
export enum MetodoPago{
    presencial='PRESENCIAL',
    deposito='DEPOSITO',
}
  
export enum RetrasoTipo{
    mensual='MES',
    bimestral='BIMESTRE',
    trimestral='TRIMESTRE',
    demas='DEMAS'
  }
  export enum EstadoAsociacion{
    conectado='CONECTADO',
    desconectado='DESCONECTADO'
  }
  export enum TipoMulta{
    retrasoPago='RETRASO-PAGO',
    reconexion='RECONEXIÓN',
    varios='VARIOS',
  }
  export enum TipoAccion{
    conexion='CONEXION',
    desconexion='DESCONEXION'
  }