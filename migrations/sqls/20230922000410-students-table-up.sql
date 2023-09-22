/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table students(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address text,
    profile_picture text,
    registraion_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    points int DEFAULT 0 NOT NULL
);