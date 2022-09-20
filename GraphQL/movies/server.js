const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const mongoose = require('mongoose')
// const nodefetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args))

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

const AllMoviesQuery = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        movies: {
            type: new GraphQLList(graphMovies.movieType),
            description: 'Returns all movies from the database',
            args: {
                directorName: { type: GraphQLString }
            },   
            resolve: async (parent, args) => {
                return args.directorName ?  await dbModal.find({ dir: args.directorName}) : ( await dbModal.find() )           
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
    query:AllMoviesQuery
})

app.use('/graphql', graphqlHTTP({
    schema: schema, 
    graphiql: true
}))

app.listen(port, () => {
    console.log('Starting REST Service')
})