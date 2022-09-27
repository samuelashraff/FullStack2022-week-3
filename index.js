const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(obj => obj.id === id)
    if (person === null) {
        response.status(404).end()
    }
    response.json(person)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`Phonebook has info on ${data.length} people\n ${date}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(obj => obj.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const newId = Math.floor(Math.random() * 10)
    if (!body.name || !body.number || data.map(obj => obj.name).includes(body.name)) {
        return response.status(404).json({
            error: 'content missing'
        })
    }
    const newPerson = {
        name: body.name,
        number: body.number,
        id: newId

    }
    data = data.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT ||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})