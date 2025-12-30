# Use Node.js 20 Alpine for smaller image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only backend files
COPY server/package*.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm ci --production

# Copy server code
COPY server/ .

# Create uploads directory
RUN mkdir -p uploads

# Expose port (Railway will set PORT env var)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
