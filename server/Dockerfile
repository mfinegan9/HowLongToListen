# Use the official Node.js image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server directory into the container
COPY . .

# Expose the port the server runs on
EXPOSE 3001

# Command to run the server
CMD ["node", "server.js"]
