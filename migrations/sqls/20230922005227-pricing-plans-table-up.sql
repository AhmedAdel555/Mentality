/* Replace with your SQL commands */
create table pricing_plans(
    id serial PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);