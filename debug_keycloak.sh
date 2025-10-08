#!/bin/bash

# Debug Keycloak startup
cd /home/derrick/Documents/workspace/hlola-grc-platform-main/keycloak-25.0.5

echo "Starting Keycloak with debug output..."
echo "This will show detailed startup information"
echo "Press Ctrl+C to stop"

# Start Keycloak and capture all output
./bin/kc.sh start-dev \
  --db=postgres \
  --db-url=jdbc:postgresql://localhost:5432/keycloak \
  --db-username=keycloak_user \
  --db-password=keycloak2025 \
  --http-port=8080 \
  --hostname-strict=false \
  --log-level=DEBUG \
  --log-console-output=default
