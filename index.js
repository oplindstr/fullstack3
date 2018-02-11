const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
var morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function getId (req) {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :body :status :response-time'))
app.use(express.static('build'))

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
  })

  app.get('/info', (req, res) => {
      var date = new Date()
      Person.find({})
    .then(persons => {
      res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${date.toUTCString()}</p>`)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
      response.json(Person.format(person))
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person
      .findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => {
        response.status(400).send({ error: 'malformatted id' })
      })
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

    Person
  .find({name: body.name})
  .then(result => {
    console.log(result.length)
    if (result.length > 0) {
      return response.status(409).json({error: 'person already exists'})
    }
    else {
      const person = new Person({
        name: body.name,
        number: body.number
      })
    
      person
        .save()
        .then(savedPerson => {
          response.json(Person.format(savedPerson))
        })
    }
  })
  })

  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        response.json(Person.format(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })
  

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })