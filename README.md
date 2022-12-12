# Storefront Backend Project

# Project Running Steps
1-node version 16
2-postgre database setup in you device or docker
for dev please create the following values
    POSTGRES_DB = dev_database
    POSTGRES_HOST = 127.0.0.1
    POSTGRES_USER = username
    POSTGRES_PASSWORD = password
for testing
    POSTGRES_DB = test_database
    POSTGRES_HOST = 127.0.0.1
    POSTGRES_USER = username
    POSTGRES_PASSWORD = password
i am not handling the database creation only migrations
3- run npm i
4- run migrations ' db-migrate up ' for dev
5- run npm run watch to start the server i provided Postman collection and Postman Environment to make it easier for you
6- for test run npm run test to run the test
