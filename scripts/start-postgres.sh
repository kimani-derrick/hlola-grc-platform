#!/bin/bash

# Script to start PostgreSQL container
# This ensures the container starts even if docker-compose is not available

CONTAINER_NAME="hlola-grc-db"
PROJECT_DIR="/home/derrick/Documents/workspace/hlola-grc-platform-main/database"

# Check if container exists
if ! docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container ${CONTAINER_NAME} does not exist. Please run docker-compose up -d first."
    exit 1
fi

# Check if container is already running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container ${CONTAINER_NAME} is already running."
    exit 0
fi

# Start the container
echo "Starting PostgreSQL container ${CONTAINER_NAME}..."
docker start ${CONTAINER_NAME}

# Wait for container to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if container is running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ PostgreSQL container ${CONTAINER_NAME} started successfully!"
    echo "Database is accessible on localhost:5433"
else
    echo "❌ Failed to start PostgreSQL container"
    exit 1
fi
