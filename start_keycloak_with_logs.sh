#!/bin/bash

# Start Keycloak with file logging
cd /home/derrick/Documents/workspace/hlola-grc-platform-main/keycloak-25.0.5

echo "Starting Keycloak with file logging..."
echo "Logs will be written to: keycloak.log"

# Create logs directory
mkdir -p logs

# Start Keycloak and redirect output to log file
./bin/kc.sh start-dev \
  --db=postgres \
  --db-url=jdbc:postgresql://localhost:5432/keycloak \
  --db-username=keycloak_user \
  --db-password=keycloak2025 \
  --http-port=8080 \
  --hostname-strict=false \
  --log-console-output=default \
  --log-file=logs/keycloak.log \
  --log-level=INFO \
  2>&1 | tee logs/keycloak-console.log
