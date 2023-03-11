# Use an official Node runtime as a parent image
FROM node:18.14.2 AS build


# Set the working directory to /app
WORKDIR /app

COPY package.json package.json

# Install any needed dependencies specified in package.json
RUN yarn install

# Copy the current directory contents into the container at /app
COPY . .

# Compile the TypeScript code into JavaScript
RUN yarn build

# NGINX
FROM nginx:1.17.8-alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Run NGINX
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf /etc/nginx/conf.d

# Expose port
EXPOSE 8080 80
CMD ["nginx", "-g", "daemon off;"]


