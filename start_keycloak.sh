#!/bin/bash

# Start Keycloak with PostgreSQL database
cd /home/derrick/Documents/workspace/hlola-grc-platform-main/keycloak-25.0.5

echo "Starting Keycloak with PostgreSQL database..."
echo "Database: keycloak"
echo "User: keycloak_user"
echo "URL: http://localhost:8080"

./bin/kc.sh start-dev \
  --db=postgres \
  --db-url=jdbc:postgresql://localhost:5432/keycloak \
  --db-username=keycloak_user \
  --db-password=keycloak2025 \
  --hostname=localhost \
  --http-port=8080 \
  --hostname-strict=false
