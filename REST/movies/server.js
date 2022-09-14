const express = require('express')
const mongoose = require('mongoose')
const nodefetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args))
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

app.get('/movie/:title', async (req, res) => {
    try {
        const movie = await MoviesModel.findOne({title: req.params.title})
        const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=5c02836408fe7aadee40bfb9302b57eb&query=${req.params.title}`

        const tbdbMeta = await nodefetch(movieURL)
        const tmdbData = await tbdbMeta.json()

        const returnMovie = {...movie._doc, "synopsis": tmdbData.results[0].overview, "image": `https://www.themoviedb.org/t/p/w220_and_h330_face/${tmdbData.results[0].poster_path}`}
        // res.json(movie)
        res.json(returnMovie)
    } catch (err) {
        res.status(500).json({message: err.message})
    }    
})

app.get('/movies/dir/:name', async (req, res) => {
    try {
        const directors = await MoviesModel.find({dir: req.params.name})
        res.json(directors)
    } catch (err) {
        res.status(500).json({message: err.message})
    }   
})

app.get('/movies/platform/:name', async (req, res) => {
    try {
        const platform = await MoviesModel.find({platform: req.params.name})
        res.json(platform)
    } catch (err) {
        res.status(500).json({message: err.message})
    }   
})

app.get('/movies/', async (req, res) => {
    try {
        const movies = await MoviesModel.find()
        res.json(movies)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

app.post('/movie/', async (req, res) => {
    try {
        const movie = new MoviesModel({...req.body})
        const insertedMovie = await movie.save()
        res.status(201).json(insertedMovie)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

app.listen(port, () => {
    console.log('Starting REST Service')
})