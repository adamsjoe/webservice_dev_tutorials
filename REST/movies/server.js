const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.connect('mongodb+srv://uhi_test:ParkerDenver@cluster0.fpefgo6.mongodb.net/test')
const connection = mongoose.connection

connection.on('error', () => {console.error.bind(console, 'error') })
connection.once('open', () => {
    console.log('Mongoose connected')
})

app.get('/', (req, res) => {
    console.log('Recieved GET Request')
    res.json('GET Data return')
})

app.get('/movie/:title', (req, res) => {
    // const movie = movies.find(singleMovie => singleMovie.title == req.params.title )
    // console.log('Recieved GET Request')
    res.json(movie)
})

app.get('/movies/dir/:name', (req, res) => {
    // const dirMovies = movies.filter(dirMovie => dirMovie.dir == req.params.name )
    // console.log('Recieved GET Request')
    res.json(dirMovies)
})

app.get('/movies/', (req, res) => {
    // console.log('Recieved GET Request')
    // res.json(movies)
})

app.post('/movie/', (req, res) => {
    // console.log('Recieved POST Request')
    // movies.push(req.body)
    res.json('movie added')
})

app.listen(port, () => {
    console.log('Starting REST Service')
})