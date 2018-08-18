const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const path = require("path");

const resolvers = {
  Query: {
    routine(parent, args, context, info) {
      return context.db.query.routine({ where: { id: args.routineId } }, info);
    },
    routinesByUser(parent, args, context, info) {
      return context.db.query.routines(
        {
          where: {
            creator: { id: args.userId }
          }
        },
        info
      );
    },
    routines(parent, args, context, info) {
      return context.db.query.routines(null, info);
    }
  },
  Mutation: {
    createUser(parent, args, context, info) {
      return context.db.mutation.createUser(
        {
          data: { name: args.name }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "src/server/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/server/generated/prisma.graphql",
      endpoint: "http://localhost:4466"
    })
  })
});
server.start(() => console.log("Server is running on http://localhost:4000"));
