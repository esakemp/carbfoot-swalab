const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString } = graphql

const AvailableYearType = new GraphQLObjectType({
  name: 'AvailableYear',
  fields: {
    year: { type: GraphQLString },
  },
})

module.exports = AvailableYearType
