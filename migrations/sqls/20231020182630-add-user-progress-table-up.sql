/* Replace with your SQL commands */

CREATE TYPE progress_status AS ENUM ('not finished', 'pending', 'finished');

create table student_progress(
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id  uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'not finished' NOT NULL,
  PRIMARY KEY (student_id, topic_id)
);