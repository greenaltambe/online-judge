#!/bin/bash

echo "Stopping services..."

if [ -f docker-compose.prod.yml ]; then
    docker compose -f docker-compose.yml -f docker-compose.prod.yml down
else
    docker compose down
fi

echo "Services stopped."