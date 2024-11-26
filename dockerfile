# Use Node.js as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install Prisma CLI globally (if needed)
RUN npm install -g prisma

# Build the TypeScript files
RUN npm run build

# Expose the server's port
EXPOSE 3000

# Define the command to run the server
CMD ["npm", "run", "start:prod"]
