/* Replace with your SQL commands */

CREATE TABLE user_table(
id SERIAL PRIMARY KEY,
email VARCHAR UNIQUE,
first_name VARCHAR,
last_name VARCHAR,
password VARCHAR
);

INSERT INTO user_table (email,first_name,last_name, password) VALUES('admin@local.com','test','User','$2b$10$tIdk.GsndSRMyzyOSGrge.IJZq6BhK4ZjAZ61F2OOZSkFGdsXCt5y');