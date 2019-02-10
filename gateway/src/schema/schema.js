const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
} = graphql

const CountryType = new GraphQLObjectType({
    name: 'Country',
    fields: {    
        code: { type: GraphQLString },
        name: { type: GraphQLString },
        
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
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})