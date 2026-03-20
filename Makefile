# Simple Makefile for common tasks
# Usage examples:
#   make install       Install dependencies
#   make dev           Start dev server (nodemon)
#   make start         Start server (node)
#   make seed          Run seeder (if applicable)
#   make lint          Placeholder (no linter configured)
#   make clean         Remove node_modules
#   make env           Show required env variables

.PHONY: install dev start seed lint format tidy clean env

NODE_BIN=node
NPM_BIN=npm

install:
	$(NPM_BIN) install

dev:
	$(NPM_BIN) run dev

start:
	$(NODE_BIN) server.js

seed:
	@ if [ -f seeder.js ]; then \
		$(NODE_BIN) seeder.js; \
		else echo "No seeder.js found"; fi

lint:
	$(NPM_BIN) run lint

format:
	$(NPM_BIN) run format

tidy:
	$(NPM_BIN) run tidy

clean:
	rm -rf node_modules

docker:
	docker build -t kostkita .
	docker run -p 5001:5001 --env-file .env kostkita

env:
	@echo "Required env vars:" && \
	echo "  - SECRET" && \
	echo "  - DB_URI" && \
	echo "  - CLOUDINARY_CLOUD_NAME" && \
	echo "  - CLOUDINARY_API_KEY" && \
	echo "  - CLOUDINARY_API_SECRET" && \
	echo "  - MAPBOX_API_KEY" && \
	echo "Current .env present?" && [ -f .env ] && echo "  -> yes" || echo "  -> no"
