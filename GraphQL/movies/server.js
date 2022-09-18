const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLList } = require('graphql')
const mongoose = require('mongoose')
// const nodefetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args))

const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const dbModal = require('./models/mongo')
const graphMovies = require('./models/graphql')

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
            resolve: (parent, args) => dbModal.find()
        }
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
    console.log('Starting REST Service')
})