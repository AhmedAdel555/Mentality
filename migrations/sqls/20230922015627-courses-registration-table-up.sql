/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table courses_registration(
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid Not NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_progress int DEFAULT 0 NOT NULL,
  last_update date Not NULL
);