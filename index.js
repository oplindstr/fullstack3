const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
var morgan = require('morgan')

morgan.token('body', function getId (req) {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :body :status :response-time'))

let persons = [
    {
      name: 'Arto Hellas44',
      number: '040-123465',
      id: 1
    },
    {
        name: 'Arto Hellas2',
        number: '040-1234654',
        id: 2
    },
    {
        name: 'Arto Hellas3',
        number: '040-1234653',
        id: 3
    },
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
      var date = new Date()
    res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${date.toUTCString()}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id )
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body

    morgan.token('type', function (req, res) { return req.headers['content-type'] })
  
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    }

    if (body.number === undefined) {
      return response.status(400).json({error: 'number missing'})
    }

    const existingPerson = persons.find(person => person.name === body.name)

    if (existingPerson) {
      return response.status(400).json({error: 'name must be unique'})
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 1000000) + 1000
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })