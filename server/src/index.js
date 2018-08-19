const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const morgan = require("morgan");
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
  typeDefs: path.resolve(__dirname, "schema.graphql"),
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: path.resolve(__dirname, "generated/prisma.graphql"),
      endpoint: "http://localhost:4466"
    })
  })
});

server.express.use(morgan("dev"));
server.start(
  {
    endpoint: "/graphql",
    getEndpoint: true,
    subscriptions: "/subscriptions",
    playground: "/playground"
  },
  ({ port }) => console.log(`Server is running on http://localhost:${port}`)
);
