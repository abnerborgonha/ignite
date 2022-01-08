import { json } from 'body-parser'
import express, { Request, Response, NextFunction, response } from 'express'
import { v4 as uuidv4 } from 'uuid'

interface IStatament {
  description?: string
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

const app = express()

app.use(express.json())

let customers: IAccount[] = []

function varifyIfexistsAccountCPFMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' })
  }

  request.customer = customer

  return next()
}

function getBalance(statement: IStatament[]): number {
  const balance = statement.reduce((accumulator, operation) => {
    if (operation.type === 'credit') {
      return accumulator + operation.amount
    }

    return accumulator - operation.amount
  }, 0)

  return balance
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' })
  }

  const accountId = uuidv4()

  customers.push({
    id: accountId,
    cpf,
    name,
    statement: []
  })

  return response.status(201).send()
})

app.get(
  '/statement',
  varifyIfexistsAccountCPFMiddleware,
  (request, response) => {
    const { customer } = request

    return response.json(customer?.statement)
  }
)

app.post(
  '/deposit',
  varifyIfexistsAccountCPFMiddleware,
  (request, response) => {
    const { customer } = request
    const { description, amount } = request.body

    const stamentOperation: IStatament = {
      type: 'credit',
      amount,
      description,
      created_at: new Date()
    }

    customer?.statement.push(stamentOperation)

    return response.status(201).send()
  }
)

app.post(
  '/withdraw',
  varifyIfexistsAccountCPFMiddleware,
  (request, response) => {
    const { customer } = request
    const { amount } = request.body

    const balance = getBalance(customer.statement)

    if (balance < amount)
      return response.status(400).json({ error: 'Insufficient funds.' })

    const stamentOperation: IStatament = {
      type: 'debit',
      amount,
      created_at: new Date()
    }

    customer.statement.push(stamentOperation)

    return response.status(201).send()
  }
)

app.get(
  '/statement/date',
  varifyIfexistsAccountCPFMiddleware,
  (request, response) => {
    const { customer } = request
    const { date } = request.query

    const dateFormat = new Date(date + ' 00:00')

    const statement = customer.statement.filter(
      statement =>
        statement.created_at.toDateString() === dateFormat.toDateString()
    )

    return response.json(statement)
  }
)

app.put('/account', varifyIfexistsAccountCPFMiddleware, (request, response) => {
  const { name } = request.body
  const { customer } = request

  customer.name = name

  return response.status(201).send()
})

app.get('/account', varifyIfexistsAccountCPFMiddleware, (request, response) => {
  const { customer } = request

  return response.json(customer)
})

app.delete('/account', varifyIfexistsAccountCPFMiddleware, (request, response) => {
  const { customer } = request

  const removedCustomer: IAccount = customer

  const modefyCustomers = customers.filter(customer => !(customer === removedCustomer))

  customers = modefyCustomers

  return response.json(customers)
})

app.listen(3033, () => {
  console.log('Server linsten on port 3033')
})
