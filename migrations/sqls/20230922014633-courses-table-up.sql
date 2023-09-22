/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table courses(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    tilte VARCHAR(255) NOT NULL,
    description text NOT NULL,
    instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
    level_id integer REFERENCES levels(id) ON DELETE SET NULL
);