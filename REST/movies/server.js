const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.connect('mongodb+srv://testuser:ParkerDenver@webservices.yhgufpp.mongodb.net/Movies')
const connection = mongoose.connection
connection.on('error', () => {console.error.bind(console, 'error') })
connection.once('open', () => {
    console.log('Mongoose connected')
})

const MoviesModel = require('./models/moviesModel')

app.get('/movie/:title', (req, res) => {
    // const movie = movies.find(singleMovie => singleMovie.title == req.params.title )    
    res.json(movie)
})

app.get('/movies/dir/:name', (req, res) => {
    // const dirMovies = movies.filter(dirMovie => dirMovie.dir == req.params.name )
    res.json(dirMovies)
})

app.get('/movies/', async (req, res) => {
    // console.log('req >', req, '<')
    try {
        const movies = await MoviesModel.find()
        res.json(movies)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

app.post('/movie/', (req, res) => {
    // console.log('Recieved POST Request')
    // movies.push(req.body)
    res.json('movie added')
})

app.listen(port, () => {
    console.log('Starting REST Service')
})