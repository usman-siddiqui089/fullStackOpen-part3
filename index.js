require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-42-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
]
app.use(cors())
app.use(express.static('build'))
app.use(express.json()) //json-parser
morgan.token('body',(req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request,response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request,response,next) => {
  Person.find({})
    .then(result => {
      const entriesCount = result.length
      const date = new Date()
      response.send(`
                <div>
                    <p>Phonebook has info for ${entriesCount} people</p>
                    <p>${date}</p>
                </div>
            `)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons/:id', (request,response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const newPerson = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(updatedPerson => {
      console.log('UPDATED PERSON: ',updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons/', (request,response, next) => {
  const body = request.body
  const isDuplicate = persons.find(person => person.name === body.name)
  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'Name or Number is missing. Please try again.'
    })
  }
  else if(isDuplicate){
    return response.status(400).json({
      error: 'Duplicate name exists. Try new.'
    })
  }
  else{
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
    newPerson.save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => {
        response.json(savedAndFormattedPerson)
      })
      .catch(error => {
        next(error)
      })
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).send(error.message)
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})