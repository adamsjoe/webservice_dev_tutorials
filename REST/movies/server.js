const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let movies = [
    {
        id: '1',
        title: 'Zack Snyders Justice League',
        dir: 'Zack Synder',
        platform: 'Google TV'
    },
    {
        id: '2',
        title: 'Man of steel',
        dir: 'Zack Synder',
        platform: 'Google TV'        
    },
    {
        id: '3',
        title: 'Batman vs Superman',
        dir: 'Zack Synder',
        platform: 'Google TV'        
    },
    {
        id: '4',
        title: 'Wolf of Wall Street',
        dir: 'Martin Scorsese',
        platform: 'Amazon Prime'
    }
]

app.get('/', (req, res) => {
    console.log('Recieved GET Request')
    res.json('GET Data return')
})

app.get('/movie/:title', (req, res) => {
    const movie = movies.find(singleMovie => singleMovie.title == req.params.title )
    // console.log('Recieved GET Request')
    res.json(movie)
})

app.get('/movies/dir/:name', (req, res) => {
    const dirMovies = movies.filter(dirMovie => dirMovie.dir == req.params.name )
    // console.log('Recieved GET Request')
    res.json(dirMovies)
})

app.get('/movies/', (req, res) => {
    // console.log('Recieved GET Request')
    res.json(movies)
})

app.post('/movie/', (req, res) => {
    // console.log('Recieved POST Request')
    movies.push(req.body)
    res.json('movie added')
})

app.listen(port, () => {
    console.log('Starting REST Service')
})