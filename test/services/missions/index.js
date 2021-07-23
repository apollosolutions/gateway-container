require("./otel");
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

(async () => {
  const schema = buildFederatedSchema({
    typeDefs: gql`
      type Mission {
        id: ID!
        name: String
        crew: [Astronaut!]!
      }

      extend type Astronaut @key(fields: "id") {
        id: ID! @external
        missions: [Mission!]!
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
      Astronaut: {
        missions() {
          return [
            {
              id: "1",
              name: `Mission 1`,
              crew: [{ id: "1" }, { id: "2" }, { id: "3" }],
            },
          ];
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
  const { url } = await server.listen(process.env.PORT ?? 4002);
  console.log(`Missions running on ${url}`);
})();
