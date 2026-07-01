#!/bin/bash

echo "Starting services..."
docker compose up -d

echo "Following logs (Ctrl+C to exit, services keep running)..."
docker compose logs -f