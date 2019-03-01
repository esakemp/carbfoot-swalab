const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = graphql

const StatsType = new GraphQLObjectType({
  name: 'Stats',
  fields: {
    year: { type: GraphQLString },
    population: { type: GraphQLInt },
    emissions: { type: GraphQLFloat },
    perCapita: { type: GraphQLFloat },
  },
})

module.exports = StatsType
