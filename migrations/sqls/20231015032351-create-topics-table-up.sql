/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE topics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description text NOT NULL,
  topic_order integer NOT NULL,
  points int DEFAULT 0 NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE cascade,
  pricing_plan_id integer DEFAULT 1 NOT NULL REFERENCES pricing_plans(id) ON DELETE SET DEFAULT
);

