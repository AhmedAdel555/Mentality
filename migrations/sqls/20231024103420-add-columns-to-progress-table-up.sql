/* Replace with your SQL commands */
ALTER TABLE student_progress
ADD COLUMN points int DEFAULT 0 NOT NULL,
ADD COLUMN solution text;