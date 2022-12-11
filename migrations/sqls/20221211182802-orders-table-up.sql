/* Replace with your SQL commands */
CREATE TYPE VALID_STATUS AS ENUM ('active' , 'complete');


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VALID_STATUS  default 'active',
    user_id bigint REFERENCES user_table(id)
);
