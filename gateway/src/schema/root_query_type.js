const graphql = require('graphql')
const axios = require('axios')

const CountryType = require('./country_type')
const AvailableYearType = require('./available_year_type')

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    allCountries: {
      type: new GraphQLList(CountryType),
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          'http://populationservice:8000/countrystats/'
        )
        return data
      },
    },
    countries: {
      type: new GraphQLList(CountryType),
      args: { codes: { type: new GraphQLList(GraphQLString) } },
      async resolve(parentValue, args) {
        const promiseArray = args.codes.map(code =>
          axios.get(`http://populationservice:8000/countrystats/${code}`)
        )

        try {
          const countries = (await Promise.all(promiseArray)).map(
            res => res.data
          )

          return countries
        } catch (error) {
          console.error(error)
        }
      },
    },
    top10: {
      type: new GraphQLList(CountryType),
      args: { year: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://populationservice:8000/top-10-emissions/${args.year}`
        )
        return data
      },
    },
    availableYears: {
      type: new GraphQLList(AvailableYearType),
      async resolve(parentValue, args) {
        const data = [
          { year: '2014' },
          { year: '2013' },
          { year: '2012' },
          { year: '2011' },
          { year: '2010' },
        ]
        return data
      },
    },
  },
})

module.exports = RootQuery
