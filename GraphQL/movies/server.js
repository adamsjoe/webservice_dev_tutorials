const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const mongoose = require('mongoose')
const nodefetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args))

const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const dbModal = require('./models/mongo')
const graphMovies = require('./models/graphql')
const { aggregate } = require('./models/mongo')

mongoose.connect('mongodb+srv://testuser:ParkerDenver@webservices.yhgufpp.mongodb.net/Movies')
const connection = mongoose.connection
connection.on('error', () => {console.error.bind(console, 'error') })
connection.once('open', () => {
    console.log('Mongoose connected')
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        movies: {            
            type: new GraphQLList(graphMovies.movieType),
            description: 'Returns all movies from the database',
            args: {
                directorName: { type: GraphQLString },
            },   
            resolve: async (parent, args) => {  
                
                if (args.directorName) {                    
                
                    return await dbModal.find({ dir: args.directorName})
                
                } else {                    
                    const moviesData = await dbModal.find()
                
                    let movies = moviesData.map(async movie => {                        
                        // get data from tmdb
                        const getMovieData = await nodefetch(`https://api.themoviedb.org/3/search/movie?api_key=5c02836408fe7aadee40bfb9302b57eb&query=${movie.title}`)                        
                        let movieInfo = await getMovieData.json()

                        return {
                            ...movie._doc, 
                            "synopsis": movieInfo.results[0].overview, 
                            "image": `https://www.themoviedb.org/t/p/w220_and_h330_face/${movieInfo.results[0].poster_path}`
                        }
                    })

                    let allMovies = await Promise.all(movies)

                    return allMovies
                }
            }
        },   
        movie: {
            type: graphMovies.singleMovie,
            description: 'Returns a single movie from the database',
            args: {
                movieName: { type: GraphQLString }
            },
            resolve: async(parent, args) => {

                const movie = await dbModal.findOne({title: args.movieName})

                // get data from tmdb
                const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=5c02836408fe7aadee40bfb9302b57eb&query=${args.movieName}`

                const tbdbMeta = await nodefetch(movieURL)
                const tmdbData = await tbdbMeta.json()
                
                // get data from imdb
                const getImdbData = await nodefetch(`https://imdb-api.com/en/API/SearchMovie/k_a9u98xna/${movie.title}`)
                let imdbMovieInfo = await getImdbData.json()
                
                const imdbMovieID = await imdbMovieInfo.results[0].id.trim()

                // get review data
                const imdbReviews = await nodefetch(`https://imdb-api.com/en/API/Ratings/k_a9u98xna/${imdbMovieID}`)
                let imdbReviewInfo = await imdbReviews.json()

                const returnMovie = {
                    ...movie._doc, 
                    "synopsis": tmdbData.results[0].overview, 
                    "metacrtic_score": imdbReviewInfo.metacritic,
                    "image": `https://www.themoviedb.org/t/p/w220_and_h330_face/${tmdbData.results[0].poster_path}`
                }

                return await returnMovie
            }
        },              
        platforms: {
            type: new GraphQLList(graphMovies.platformType),
            description: 'Returns all platforms in system',
            resolve: async (parent, args) => {
                const platforms = await dbModal.find().distinct('platform')
                let result = []
                platforms.forEach(platform => result.push({platform: platform}))
                console.log(result)
                return result
            }
        },
        platform: {
            type: graphMovies.platformType,
            description: 'single platform',
            args: {
                platformName: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const platform = await dbModal.find().distinct('platform', { platform: args.platformName })
                return { platform: platform[0] }
            }
        },

    })
})

const schema = new GraphQLSchema({
    query:RootQueryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema, 
    graphiql: true
}))

app.listen(port, () => {
    console.log('Starting GraphQL Interface')
})