const express = require('express')
const morgan = require('morgan')
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
app.use(express.json()) //json-parser
morgan.token('body',(req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request,response) => {
    response.json(persons)
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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else{
        return response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

function getRandomID() {
    return Math.floor(Math.random() * 100000);
}

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
        const newPerson = {
            id: getRandomID(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})