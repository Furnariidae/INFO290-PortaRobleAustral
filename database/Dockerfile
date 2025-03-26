# Versión de Mongo
FROM mongo:6.0.11

# Variables de entorno
# Cambiar por seguridad
ENV MONGO_INITDB_ROOT_USERNAME=robleAustral
ENV MONGO_INITDB_ROOT_PASSWORD=robleaustral123

# Copiar archivos demostración al container y script para subirlos a Mongo
COPY ./dump /dump-recovery
COPY ./init-mongo.sh /docker-entrypoint-initdb.d/init-mongo.sh


#Evita error al ejecutar el script de ini
# Ensure the initialization script is executable
RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh

