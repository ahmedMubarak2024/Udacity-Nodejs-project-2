# Storefront Backend Project

# Project Running Steps
1-node version 16
2-postgre database setup in you device or docker
i just need a "dev_database" in postgre for running the project and "test_database" for running the test
if you are running docker use this command
docker run --name pgNodeStudnet -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
run these sqls to create the databases
CREATE DATABASE test_database
CREATE DATABASE dev_database
GRANT ALL PRIVILEGES ON DATABASE dev_database TO username
GRANT ALL PRIVILEGES ON DATABASE test_database TO username

i am expecting the that the database has credentials
user:username
password:password

i am not handling the database creation only migrations
db tables are
these only for info don't run it. it is in the migrations
CREATE TABLE IF NOT EXISTS user_table(
id SERIAL PRIMARY KEY,
email VARCHAR UNIQUE,
first_name VARCHAR,
last_name VARCHAR,
password VARCHAR
);
CREATE TABLE IF NOT EXISTS products_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL
);

CREATE TYPE VALID_STATUS AS ENUM ('active' , 'complete');

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VALID_STATUS  default 'active',
    user_id bigint REFERENCES user_table(id)
);

CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products_table(id)
);

schema
user_table
id serial ,email VARCHAR,first_name VARCHAR,last_name VARCHAR,email VARCHAR
products_table
id serial ,name VARCHAR,price integer
orders
id serial ,status VARCHAR,user_id bigint user_table(id)
order_products
id serial ,  quantity integer, order_id bigint REFERENCES orders(id),product_id bigint REFERENCES products_table(id)
type VALID_STATUS AS ENUM ('active' , 'complete');

you need to run the following commands by order
3- run npm i
4- run migrations ' db-migrate up ' for dev
5- run "npm run watch" to start the server i provided Postman collection and Postman Environment to make it easier for you also you can test on browser using 127.0.0.1:8085
6- once you run the project you can use the default user

"email":"admin@local.com",
"password":"testpassword"

7- for test run npm run test to run the test

note postman collection and postman environment are included 
apis:
post /login
takes body: {
    "email":"admin@local.com",
    "password":"testpassword"
}
return jwtToken

post /user
body:{
    "firstName":"user2",
    "lastName":"user2",
    "email":"user2@local.com",
    "password":"testpassword"
}
return jwtToken

get /user
header:authorization:{{token}}
return :array of users

get /product
return :array of products

post /product
header:authorization:{{token}}
body :{
    "name":"Product From PostMan 3",
    "price":12
}
return :product

get /product/:id
return product

get /orders
header:authorization:{{token}}
return list of orders

post /orders/1
header:authorization:{{token}}
body: {
    "product":2,
    "quantity":5
}
return orderdata

get /orders/:id
header:authorization:{{token}}
return orderdata with list of product

i expect two env files please create them in root directory this is why i didn't remove it in git but the reviewer request it so here they are :
.env.dev
POSTGRES_DB = dev_database
ENV = dev
POSTGRES_HOST = 127.0.0.1
POSTGRES_USER = username
POSTGRES_PASSWORD = password
BCRYPT_PASSWORD = SECRET_PASSWORD
SALT_ROUNDS = 10
JWT_SECRET = SECRET_USED_IN_JWT

------------------------------------

.env.test
POSTGRES_DB = test_database
ENV = test
POSTGRES_HOST = 127.0.0.1
POSTGRES_USER = username
POSTGRES_PASSWORD = password
BCRYPT_PASSWORD = SECRET_PASSWORD
SALT_ROUNDS = 10
JWT_SECRET = SECRET_USED_IN_JWT