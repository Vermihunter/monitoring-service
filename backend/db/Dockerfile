FROM mongo:7.0.5

# Copy initialization scripts
COPY init.js /docker-entrypoint-initdb.d/

# Optional: custom MongoDB config
# COPY mongod.conf /etc/mongo/mongod.conf
# CMD ["mongod", "--config", "/etc/mongo/mongod.conf"]
