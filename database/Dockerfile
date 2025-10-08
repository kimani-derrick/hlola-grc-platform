FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=hlola_grc_platform
ENV POSTGRES_USER=hlola_user
ENV POSTGRES_PASSWORD=hlola2025

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY create_tables.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD pg_isready -U hlola_user -d hlola_grc_platform
