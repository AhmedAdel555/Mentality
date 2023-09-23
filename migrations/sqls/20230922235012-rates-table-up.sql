/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table rates(
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid Not NULL REFERENCES courses(id) ON DELETE CASCADE,
  rate int NOT NULL CHECK (rate BETWEEN 1 AND 5)
);