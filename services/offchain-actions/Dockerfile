# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.


FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --no-cache git

# Set working directory
WORKDIR /app
RUN yarn add turbo
COPY . .
RUN yarn turbo prune --scope=@yc/offchain-actions --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --no-cache git

WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --ignore-engines

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo run build --filter=@yc/offchain-actions...



# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry as foundry-client

# Copy our source code into the container
WORKDIR /foundry

# Build and test the source code
COPY . .
RUN  anvil --version


FROM node:alpine AS runner
WORKDIR /app

RUN apk add --no-cache git

COPY --from=foundry-client  /usr/local/bin/forge /usr/local/bin/forge
COPY --from=foundry-client /usr/local/bin/cast /usr/local/bin/cast
COPY --from=foundry-client /usr/local/bin/anvil /usr/local/bin/anvil


# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

EXPOSE "8080"

ARG DATABASE_URL=postgres://OfirYC:B.%3F3f%2Apbf%3D2Df%21i@postgres-1.ctknysk7lqdz.us-east-1.rds.amazonaws.com:5432/postgres

CMD node services/offchain-actions/bin/index.js