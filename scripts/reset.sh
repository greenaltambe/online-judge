#!/bin/bash

echo "======================================="
echo "GreenCode Reset"
echo "======================================="
echo ""
echo "This will:"
echo "  • Stop all containers"
echo "  • Remove all volumes"
echo "  • Delete MongoDB data"
echo "  • Delete MinIO data"
echo "  • Delete local storage data"
echo "  • Remove unused Docker resources"
echo ""
read -p "Type 'yes' to continue: " response

if [ "$response" != "yes" ]; then
    echo "Reset cancelled."
    exit 0
fi

if [ -f docker-compose.prod.yml ]; then
    docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
else
    docker compose down -v
fi

docker system prune -f

echo ""
echo "Reset complete."
echo "Run ./scripts/dev.sh to start again."