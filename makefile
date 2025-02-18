# Define variables
DOCKER_COMPOSE_LOCAL=docker compose -f docker-compose.yml

# LOCAL Commands
.PHONY: stop-local
stop-local:
	$(DOCKER_COMPOSE_LOCAL) down

.PHONY: start-local
start-local:
	$(DOCKER_COMPOSE_LOCAL) up --build