interface IStatament {
  description: string
  amount: number
  type: 'credit' | 'debit'
  created_at: Date
}


interface IAccount {
  id: string
  cpf: string
  name: string
  statement: IStatament[]
}

declare namespace Express {
  export interface Request {
     customer?: IAccount
  }
}