import { Users } from "./users"

export class Operation{
    id: number=0
    tipo_deposito: String=""
    monto: number=0.00
    tipo_tasa: String=""
    tipo_periodo: String=""
    periodo: number=0
    porcentaje_tasa:number=0.00
    capitalizacion: number=0
    fecha_operacion: Date=new Date(Date.now())
    users: Users=new Users()
  }
