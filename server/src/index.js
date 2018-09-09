const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const morgan = require("morgan");
const path = require("path");

const resolvers = {
  Query: {
    exercises(parent, args, context, info) {
      const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);
      const capitalizeWords = phrase =>
        phrase
          .split(" ")
          .map(capitalize)
          .join(" ");

      const nameFilter = args.filter && args.filter.name;

      // If a filter is given, roughly use a case-insensitive search by name.
      // If no filter is given, just return in alphabetical order.
      // Limit to 15 records in both cases.
      // TODO: Try out something like Algolia for search
      const queryArgs =
        args.filter && args.filter.name
          ? {
              where: {
                OR: [
                  { name_contains: nameFilter },
                  { name_contains: capitalizeWords(nameFilter) }
                ]
              }
            }
          : { orderBy: "name_ASC" };

      return context.db.query.exercises({ ...queryArgs, first: 15 }, info);
    },
    routine(parent, args, context, info) {
      return context.db.query.routine({ where: { id: args.id } }, info);
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
    createExercise(parent, args, context, info) {
      return context.db.mutation.createExercise(
        {
          data: { name: args.name }
        },
        info
      );
    },
    createRoutineSet(parent, args, context, info) {
      const {
        input: { routineId, exerciseId, setCount, repCount }
      } = args;

      return context.db.mutation.createRoutineSet(
        {
          data: {
            routine: { connect: { id: routineId } },
            exercise: { connect: { id: exerciseId } },
            setCount: setCount || 0,
            repCount: repCount || 0
          }
        },
        info
      );
    },
    async updateRoutine(parent, args, context, info) {
      const {
        input: { id, ...fields }
      } = args;

      const routineExists = await context.db.exists.Routine({ id });
      if (!routineExists) {
        throw new Error(`Routine with ID "${id}" does not exist`);
      }

      return context.db.mutation.updateRoutine(
        {
          where: { id },
          data: fields
        },
        info
      );
    },
    deleteRoutineSet(parent, args, context, info) {
      const { id } = args;
      return context.db.mutation.deleteRoutineSet(
        {
          where: { id }
        },
        info
      );
    },
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
