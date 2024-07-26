# Use the official Node.js image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server directory into the container
COPY server/ .

# Expose the port the app runs on
EXPOSE 3007

# Command to run the application
CMD ["node", "server.js"]
