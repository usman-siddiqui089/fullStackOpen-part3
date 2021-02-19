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
        number: "040-123456"
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: "12-42-234345"
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: "39-23-6423122"
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

app.get('/info', (request,response) => {
    const entriesCount = persons.length
    const date = new Date()
    response.send(`
        <div>
            <p>Phonebook has info for ${entriesCount} people</p>
            <p>${date}</p>
        </div>`)
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request,response) => {
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
        newPerson.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})