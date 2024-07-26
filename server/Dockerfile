# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the server source code
COPY server/ ./

# Expose the port your server runs on
EXPOSE 3007

# Run the server
CMD ["node", "server.js"]  # Replace 'server.js' with your actual entry point if different
