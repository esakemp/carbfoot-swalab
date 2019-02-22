const graphql = require('graphql')
const StatsType = require('./stats_type')

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql

const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: {
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    stats: { type: GraphQLList(StatsType) },
  },
})

module.exports = CountryType
