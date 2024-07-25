# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY server/package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY server/src ./

# Run the web service on container startup.
CMD [ "node", "server.js" ]

# Document that the service listens on port 8080.
EXPOSE 8080
