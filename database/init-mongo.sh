#!/bin/bash
#Script para cargar información demo en Mongo
set -e

echo "Esperando a que MongoDB esté listo..."
sleep 30  # Give more time for MongoDB to start

echo "Creating admin user if not exists..."
mongosh <<EOF
use admin
if (db.getUser("robleAustral") === null) {
  db.createUser({
    user: "robleAustral",
    pwd: "robleaustral123",
    roles: [{ role: "root", db: "admin" }]
  });
}
EOF

echo "Creating initial collection..."
mongosh -u robleAustral -p robleaustral123 --authenticationDatabase admin <<EOF
use dbRobleAustral
db.createCollection("initCollection")
EOF

echo "Restoring the dump..."
mongorestore --username robleAustral --password robleaustral123 --authenticationDatabase admin /dump-recovery