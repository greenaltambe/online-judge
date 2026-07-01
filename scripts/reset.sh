#!/bin/bash

echo "WARNING: This will delete all data (database, uploads, etc.)"
echo "Are you sure? Type 'yes' to confirm:"
read -r response

if [ "$response" = "yes" ]; then
    echo "Stopping and removing all containers and volumes..."
    docker compose down -v
    
    echo "Removing build cache..."
    docker system prune -f
    
    echo "Complete reset done. Run ./scripts/dev.sh to start fresh"
else
    echo "Reset cancelled"
fi