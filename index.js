require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))



// app.use(morgan('tiny'))
//Morgan token looking for POST method and returning a JSON'd body
morgan.token('post', function (tokens,req,res) {
  if(tokens.method(req,res) === 'POST'){
    return JSON.stringify(req.body)
  }
})

// Morgan middleware using custom configuration
app.use(morgan(function (tokens,req,res) {
  return[
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    // custom token being called
    tokens.post(tokens,req,res)
  ].join(' ')
}))

app.use(cors())



//GET all database
app.get('/api/persons', (request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//GET all
// app.get("/api/persons", (request,response) => {
//     response.json(persons);
// })
//GET info page
app.get('/info', async (request,response) => {
  const count = await Person.countDocuments({})

  let dateTime = new Date()

  response.send(`<p>Phonebook has info for  ${count} people</p> <p>Request at : ${dateTime} </p>`)

})
//GET specific person
app.get('/api/persons/:id', (request,response,next) => {
  // const id = request.params.id;
  // const person = persons.find(person => person.id === id.toString());
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
    .catch(error => next(error))

})
//DELETE
app.delete('/api/persons/:id', (request,response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
//POST
app.post('/api/persons', (request,response,next) => {
  const body = request.body

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
  const person =  new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))

})

//PUT
app.put('/api/persons/:id', (request,response,next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if(!person){
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unkown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)



// driver setting port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
