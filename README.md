# Workout App GraphQL

## Deployment

### Client

Make sure that the correct URI for the GraphQL API is set in `.env.production.local`.

Then run:

```
# From root
cd client
yarn build
cd build
now
```

### Server

Run:

```
# From root
cd server
now -e PRISMA_ENDPOINT="<prisma_endpoint>" -e PRISMA_SECRET="<prisma_secret>"
```

### Prisma

> ⚠️ Assumes that:
>
> 1.  the inital deploy has already happened (`PRISMA_ENDPOINT` already exists)
> 2.  `./server/.env.production.local` exists with `PRISMA_ENDPOINT` set to the existing endpoint and `PRISMA_SECRET` set to the generated secret for that endpoint

```
# From root
cd server/prisma
prisma deploy -e ../.env.production.local
```
