/* Replace with your SQL commands */
CREATE OR REPLACE FUNCTION add_topic_to_progress(
    id_course UUID,
    topic_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Step 1: Get registered user IDs for the course
    CREATE TEMPORARY TABLE registered_users AS
    SELECT student_id
    FROM courses_registration
    WHERE course_id = id_course;

    -- Step 2: Insert topic for each registered user
    INSERT INTO student_progress (student_id, topic_id, status)
    SELECT ru.student_id, topic_id, 'not finished'
    FROM registered_users ru;

    -- Step 3: Cleanup temporary table
    DROP TABLE registered_users;
END $$ LANGUAGE plpgsql;