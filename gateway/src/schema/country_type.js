const graphql = require('graphql')
const StatsType = require('./stats_type')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
} = graphql

const CountryType = new GraphQLObjectType({
  name: 'Country',
  fields: {
    
    //country specific info
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    stats: { type: GraphQLList(StatsType) },

    //information for top10 list
    year: { type: GraphQLString },
    population: { type: GraphQLInt },
    emissions: { type: GraphQLFloat },
    normalized: { type: GraphQLFloat },
  },
})

module.exports = CountryType
