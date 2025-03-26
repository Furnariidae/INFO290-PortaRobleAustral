# Build stage
ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy only package files to cache npm install
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the code and build
COPY . /app
RUN npm run build

# Production stage: use a minimal image to serve the build
FROM node:${NODE_VERSION}-alpine AS runtime

# Install a lightweight static file server
RUN npm install -g serve

WORKDIR /app
# Copy the build output from the previous stage
COPY --from=build /app/build /app/build

EXPOSE 3008

# Correr(serve) en el puerto 3008
CMD ["serve", "-s", "build", "-l", "3008"]