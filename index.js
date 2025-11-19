
const express = require('express')
const app = express()
app.use(express.json())

let dateTime = new Date();



let persons = [

    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


function getRandomID() {
    const min = 1;
    const max = 10000
return Math.floor(Math.random() * (max-min)) + min;
}

//GET all
app.get("/api/persons", (request,response) => {
    response.json(persons);
})
//GET info page
app.get("/info", (request,response) => {
    
    response.send(`<p>Phonebook has info for  ${persons.length} people</p> <p>Request at : ${dateTime} </p>`)
    
})
//GET specific person
app.get("/api/persons/:id", (request,response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id.toString());
    
    if(person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
}) 
//DELETE
app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})
//POST
app.post('/api/persons', (request,response) => {
    const body = request.body
    const personFound = persons.find((e) => e.name == body.name)

    if(personFound){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    if(!body.name) {
        return response.status(400).json({
            error: 'name is missing'  
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const person = {
        id: String(getRandomID()),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)

})







// driver setting port
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})
