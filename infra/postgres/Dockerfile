# Postgres Container
FROM postgres:17

# Set environment variables
ENV POSTGRES_DB db_postgres
ENV POSTGRES_USER user_postgres
ENV POSTGRES_PASSWORD password_postgres

# Copy the custom entrypoint script into the container
# COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Expose the default PostgreSQL port (5432)
EXPOSE 5432