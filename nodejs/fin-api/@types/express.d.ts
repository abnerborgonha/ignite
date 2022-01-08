interface IAccount {
  id: string
  cpf: string
  name: string
  statement: string[]
}

declare namespace Express {
  export interface Request {
     customer?: IAccount
  }
}