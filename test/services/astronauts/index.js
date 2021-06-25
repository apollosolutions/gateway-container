import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const schema = buildFederatedSchema({
  typeDefs: gql`
    type Astronaut @key(fields: "id") {
      id: ID!
      name: String
    }

    type Query {
      astronaut(id: ID!): Astronaut
      echoHeaderA(name: String!): String
    }
  `,
  resolvers: {
    Query: {
      astronaut(_, { id }) {
        return { id, name: `Astronaut ${id}` };
      },
      echoHeaderA(_s, { name }, ctx) {
        return ctx.req.header(name);
      },
    },
    Astronaut: {
      __resolveReference({ id }) {
        return { id, name: `Astronaut ${id}` };
      },
    },
  },
});

const server = new ApolloServer({
  schema,
  context(ctx) {
    return ctx;
  },
});
const { url } = await server.listen(process.env.PORT ?? 4001);
console.log(`Astronauts running on ${url}`);
