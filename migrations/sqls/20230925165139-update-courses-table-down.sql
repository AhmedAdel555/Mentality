/* Replace with your SQL commands */
ALTER TABLE courses
ALTER COLUMN requirements DROP NOT NULL,
ALTER COLUMN picture DROP NOT NULL;

ALTER TABLE courses
DROP COLUMN requirements,
DROP COLUMN picture;

ALTER TABLE courses
RENAME COLUMN title TO tilte;