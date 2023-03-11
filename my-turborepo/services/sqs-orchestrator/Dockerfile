# Use an official Node runtime as a parent image
FROM node:18.14.2

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies specified in package.json
RUN yarn install

# Compile the TypeScript code into JavaScript
RUN yarn tsc
RUN yarn build


# Run EventsRouter.js when the container launches
CMD ["node", "dist/main.js"]
