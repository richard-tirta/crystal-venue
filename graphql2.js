const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')
const { buildSchema } = require('graphql');
const doteenv = require('dotenv');
const Pool = require('pg').Pool;
const joinMonster = require('join-monster')

doteenv.config();

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

const Users = new graphql.GraphQLObjectType({
  name: 'Users',
  sqlTable: 'users',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: graphql.GraphQLInt,
      sqlColumn: 'id',
    },
    userid: {
      type: graphql.GraphQLString,
      sqlColumn: 'userid',
    },
    discriminator: {
      type: graphql.GraphQLString,
      sqlColumn: 'discriminator',
    },
    avatar: {
      type: graphql.GraphQLString,
      sqlColumn: 'avatar',
    },
    ismember: {
      type: graphql.GraphQLBoolean,
      sqlColumn: 'ismember',
    },
    havevenue: {
      type: graphql.GraphQLString,
      sqlColumn: 'havevenue',
    },
    birthday: {
      type: graphql.GraphQLString,
      sqlColumn: 'birthday',
    },
  })
});
 
const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "Hello world!"
    },
    users: {
      type: Users,
      args: {
        id: {type: graphql.GraphQLInt},
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql)
        })
      }
    },
  })
})

const schema = new graphql.GraphQLSchema({
  query: QueryRoot,
});
 
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));