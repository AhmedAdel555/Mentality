/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table subscriptions(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pricing_plan_id integer NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date date NOT NULL
);