const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql')

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