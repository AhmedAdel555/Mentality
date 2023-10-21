/* Replace with your SQL commands */
CREATE OR REPLACE FUNCTION populate_user_progress(
    registered_course_id UUID,
    registered_user_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Step 2: Populate user_progress table
    INSERT INTO student_progress (student_id, topic_id, status)
    SELECT registered_user_id, t.id, 'not finished'
    FROM courses c
    JOIN lessons l ON c.id = l.course_id
    JOIN topics t ON l.id = t.lesson_id
    WHERE c.id = registered_course_id;
END $$ LANGUAGE plpgsql;