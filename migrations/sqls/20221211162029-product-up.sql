/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL
);

INSERT INTO products_table (name,price) VALUES('Testproduct',100);