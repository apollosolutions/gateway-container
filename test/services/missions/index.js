import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const schema = buildFederatedSchema({
  typeDefs: gql`
    type Mission {
      id: ID!
      name: String
      crew: [Astronaut!]!
    }

    extend type Astronaut @key(fields: "id") {
      id: ID! @external
    }

    type Query {
      mission(id: ID!): Mission
      echoHeaderM(name: String!): String
    }
  `,
  resolvers: {
    Query: {
      mission(_, { id }) {
        return {
          id,
          name: `Mission ${id}`,
          crew: [{ id: "1" }, { id: "2" }, { id: "3" }],
        };
      },
      echoHeaderM(_s, { name }, ctx) {
        return ctx.req.header(name);
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
