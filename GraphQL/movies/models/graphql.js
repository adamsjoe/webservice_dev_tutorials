const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql')

const dbModal = require('./mongo')

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'A single movie in the Database',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        dir: { type: GraphQLNonNull(GraphQLString) },
        platform: { type: GraphQLNonNull(GraphQLString)}
    })
})

exports.movieType = MovieType

const PlatformType = new GraphQLObjectType({
    name: 'Platform',
    description: 'A platform with min 1 movie',
    fields: () => ({
        platform: { type: GraphQLString },
        movies: {
            type: GraphQLList(MovieType),
            resolve: (movie) => {
                return dbModal.find({platform: movie.platform})
            }
        }
    })
})

exports.platformType = PlatformType