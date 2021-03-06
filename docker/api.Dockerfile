# ----------------------------------------------------------
# Multi build file - One for building our app and one for production
#
# Seperate containers so that the production container does not
# Contain all the development dependencies and source files, only
# output .js files and production dependencies
# ----------------------------------------------------------

# NOTE: The .dockerignore needs to explicitly allow files to be 'visible' or the build will fail

# ----------------------------------------------------------
# Docker cach's intermediate containers when building images
# and uses the cached containers if there has been no changes to 
# the build before that current step. Becuase of this, it is best
# to install all dependencies at the start so that they are cached and 
# any subsequent changes to source files will no require deps to be
# reinstalled. Only changes to your config files will cause reinstalling
# of dependencies.
# ----------------------------------------------------------

# -----------------------------------------
# Build Container - Initail Dependency Install 
# -----------------------------------------
FROM node:alpine AS builder-setup

# Set the node environment
ENV NODE_ENV development

# Create the tmp working directory
WORKDIR /tmp

# Copy all files required for the build container to run (do not copy source files)
COPY angular.json package.json package-lock.json tsconfig.json tsconfig.libs.json /tmp/

RUN cd /tmp 

# Disable the MongoMemoryServer Post Install
ENV MONGOMS_DISABLE_POSTINSTALL=1

# TODO -> Onlyd dev dependencies? And only for building the API
# Install all deps
RUN npm install

# -----------------------------------------
# Production Container - Initail Dependency Install 
# -----------------------------------------
FROM node:alpine AS production-setup

# Set the node environment
# This also means only prodcution npm's are installaed
ENV NODE_ENV production

# Create the app working directory
WORKDIR /app

COPY package-lock.json /app

# TODO -> Dynamic from ENV import?
# Copy the package.json from the app specific directory
COPY apps/servers/api/package.json  /app

RUN cd /app

# Install all production dependencies
RUN npm install --only=prod --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
  cat npm-debug.log; \
  fi) && false)


# -----------------------------------------
# Build Container - Build all required projects 
# -----------------------------------------
FROM builder-setup as builder

ENV NODE_ENV development

# Copy all src files
COPY apps/servers/api/ /tmp/apps/servers/api

# Make out output directory
RUN mkdir -p /tmp/dist

# TODO - Don't copy frontend libs?
# Copt all libs 
COPY libs/ /tmp/libs

RUN cd /tmp/

# Build the libs
RUN npm run build:libs

# Run the production build task (from app specifig package.json)
COPY apps/servers/api/package.json  /tmp
RUN npm run build

# -----------------------------------------
# Production Container 
# -----------------------------------------
FROM production-setup as production

ENV NODE_ENV production

RUN mkdir /app/api

# Copy the distribution folder from the builder file
COPY --from=builder /tmp/dist /app

RUN cd /app

# Expose port 3000
# This port must match the port for the K8's continer health probe
# It must be exposed else the probe will fail
EXPOSE 3000

# Run the start command
CMD node api/main.js
