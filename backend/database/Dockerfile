FROM mysql:8.0

# Set environment credentials and database name
ENV MYSQL_DATABASE=ticket_booking
ENV MYSQL_ROOT_PASSWORD=rootpassword

# Any .sql file placed here runs on initial container startup
COPY data.sql /docker-entrypoint-initdb.d/

EXPOSE 3306