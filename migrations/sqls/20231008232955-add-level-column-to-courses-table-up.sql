/* Replace with your SQL commands */

-- Create the ENUM type
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'expert');

-- Add the column to the existing table
ALTER TABLE courses ADD COLUMN level course_level;