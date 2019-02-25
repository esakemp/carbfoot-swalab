const graphql = require('graphql')
const axios = require('axios')

const CountryType = require('./country_type')

const { GraphQLObjectType, GraphQLString, GraphQLList } = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    countries: {
      type: new GraphQLList(CountryType),
      args: { codes: { type: new GraphQLList(GraphQLString) } },
      async resolve(parentValue, args) {
        const { codes } = args
        if (!codes) {
          const { data } = await axios.get(
            'http://populationservice:8000/countrystats/'
          )
          return data
        } else {
          const promiseArray = args.codes.map(code =>
            axios.get(`http://populationservice:8000/countrystats/${code}`)
          )
          const countries = (await Promise.all(promiseArray)).map(
            res => res.data
          )
          return countries
        }
      },
    },
    top10: {
      type: new GraphQLList(new GraphQLList(CountryType)),
      args: { year: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { year } = args

        if (!year) {
          const data = [
            { year: '2014' },
            { year: '2013' },
            { year: '2012' },
            { year: '2011' },
            { year: '2010' },
          ]
          return data
        }

        const emissions = await axios.get(
          `http://populationservice:8000/top-10-emissions/${args.year}`
        )
        
        const perCapita = await axios.get(
          `http://populationservice:8000/top-10-emissions-per-capita/${
            args.year
          }`
        )

        var data = [emissions.data, perCapita.data]

        return data
      },
    },
  },
})

module.exports = RootQuery
