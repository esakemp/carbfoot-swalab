const graphql = require('graphql')
const axios = require('axios')

const CountryType = require('./country_type')
const Top10Type = require('./top10_type')

const ROOTURL = 'http://populationservice:8000'

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
      type: Top10Type,
      args: { year: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { year } = args
        if (!year) {
          const { data: allTop10 } = await axios.get(
            `${ROOTURL}/top-10-emissions`
          )
          const years = allTop10.map(stat => stat.year).sort().reverse()
          return { year: years }
        }
        const { data: top10Year } = await axios.get(
          `http://populationservice:8000/top-10-emissions/${args.year}`
        )
        return top10Year
      },
    },
  },
})

module.exports = RootQuery
