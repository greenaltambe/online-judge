#!/bin/bash

echo "Starting services..."

docker compose start

echo ""
echo "Following logs..."
docker compose logs -f