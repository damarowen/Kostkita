## Production-ready Dockerfile for Kostkita (Node.js + Express)

# 1) Base image (Debian slim to avoid native module issues on Alpine)
FROM node:20-slim

# 2) Workdir
WORKDIR /usr/src/app

# 3) Install dependencies (prod only)
# Copy only package files first to leverage Docker layer cache
COPY package*.json ./
RUN npm ci --omit=dev

# 4) Copy application source
COPY . .

# 5) Environment
ENV NODE_ENV=production

# 6) Expose port (matches server.js default)
EXPOSE 5001

# 7) Improve container security by running as non-root
RUN chown -R node:node /usr/src/app
USER node

# 8) Start the server
CMD ["node", "server.js"]
