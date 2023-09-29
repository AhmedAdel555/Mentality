/* Replace with your SQL commands */
ALTER TABLE courses
RENAME COLUMN tilte TO title;

ALTER TABLE courses
ADD COLUMN requirements text NOT NULL,
ADD COLUMN picture text NOT NULL;
