# Use official Node.js LTS version image as base
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code to container
COPY . .

# Expose port your server listens on
EXPOSE 5000

# Command to run your server
CMD ["node", "server.js"]