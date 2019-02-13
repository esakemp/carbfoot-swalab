const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat
} = graphql

const StatsType = new GraphQLObjectType({
    name: 'Stats',
    fields: {
        year: { type: GraphQLString },
        population: { type: GraphQLInt },
        emissions: { type: GraphQLFloat },
        normalized: {type: GraphQLFloat}
    }
})

const CountryType = new GraphQLObjectType({
    name: 'Country',
    fields: {
        code: { type: GraphQLString },
        name: { type: GraphQLString },
        stats: { type: GraphQLList(StatsType) }

    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        country: {
            type: CountryType,
            args: { code: { type: GraphQLString } },
            async resolve(parentValue, args) {
                const { data } = await axios.get(`http://populationservice:8000/countrystats/${args.code}`)
                return data
            }
        },
        allCountries: {
            type: new GraphQLList(CountryType),
            async resolve(parentValue, args) {
                const { data } = await axios.get('http://populationservice:8000/countrystats/')
                return data
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})