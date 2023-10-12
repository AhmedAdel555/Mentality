/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table lessons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  lesson_order integer NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE cascade
);