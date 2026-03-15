#!/bin/sh
set -e

echo "Waiting for database..."

MAX_RETRIES=30
COUNTER=1
until nc -z "$PGHOST" 5432; do
  if [ "$COUNTER" -ge "$MAX_RETRIES" ]; then
    echo "Database did not become ready in time."
    exit 1
  fi
  sleep 10
  echo "Still waiting 10 seconds [total: $(( COUNTER * 10 ))]..."
  COUNTER=$(( COUNTER + 1 ))
done

echo -e "\nDatabase ready"

pnpm prisma:deploy

pnpm start:prod
