import express from 'express'

const app = express()

app.get('/', (request, response) => {
  return response.json({ message: 'Hello Ignite' })
})

app.listen(3033, () => {
  console.log('Server linsten on port 3033')
})
