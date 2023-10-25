/* Replace with your SQL commands */
CREATE TYPE topic_kind AS ENUM ('tutorial', 'task', 'exam');

ALTER TABLE topics
DROP COLUMN topic_type;

ALTER TABLE topics
ADD COLUMN topic_type topic_kind;
