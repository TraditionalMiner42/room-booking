# Build the React app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /room-booking-react

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Serve the built files with Nginx
FROM nginx:alpine

# Copy the build files to the Nginx directory
COPY --from=build /room-booking-react/build /usr/share/nginx/html

# Expose port 80    
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]