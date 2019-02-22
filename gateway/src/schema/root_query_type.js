const graphql = require('graphql')
const axios = require('axios')

const CountryType = require('./country_type')

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    country: {
      type: CountryType,
      args: { code: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://populationservice:8000/countrystats/${args.code}`
        )
        return data
      },
    },
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
  },
})

module.exports = RootQuery
