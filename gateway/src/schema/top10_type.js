const graphql = require('graphql')
const CountryType = require('./country_type')

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql

const Top10Type = new GraphQLObjectType({
  name: 'Top10',
  fields: {
    year: {type: new GraphQLList(GraphQLString)},
    emissions: {type: new GraphQLList(CountryType)},
    perCapita: {type: new GraphQLList(CountryType)}
  },
})

module.exports = Top10Type
