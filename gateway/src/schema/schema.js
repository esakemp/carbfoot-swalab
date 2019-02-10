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
            resolve(parentValue, args) {
                return axios.get(`http://populationservice:8000/countrystats/${args.code}`)
                    .then(response => response)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})