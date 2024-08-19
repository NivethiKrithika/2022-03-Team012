# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:19-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci --legacy-peer-dep
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Exposes the default port for webapps
EXPOSE 80
# Start the app
CMD ["npx", "serve", "-s", "build", "-p", "80"]