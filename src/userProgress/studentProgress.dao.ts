import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import StudentProgressModel from "./studentProgress.model";

class StudentProgressDAO {

  public async populateStudentProgressForCourse(courseId:string, studentId:string): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT populate_user_progress($1, $2);`;
      await connection.query(sql, [
        courseId,
        studentId
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updateStudentProgress(studentProgress: StudentProgressModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE student_progress 
                  SET  status = $1
                  WHERE student_id = $2 AND topic_id = $3;`;
      await connection.query(sql, [
         studentProgress.status,
         studentProgress.student.id,
         studentProgress.topic.id
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllStudentProgress(student_id: string): Promise<StudentProgressModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT jsonb_agg(jsonb_build_object(
        'student', jsonb_build_object(
          'id', s.id,
          'user_name', s.user_name,
          'email', s.email,
          'password', s.password,
          'profile_picture', s.profile_picture,
          'phone_number', s.phone_number,
          'address', s.address,
          'reset_password_token', s.reset_password_token,
          'points', s.points
         ),
         'topic, jsonb_build_object(
          'id', t.id,
          'title', t.title,
          'description', t.description,
          'topic_order', t.topic_order,
          'points', t.points,
          'content_url', t.content_url,
          'topic_type', t.topic_type,
          'lesson', jsonb_build_object(
            'id', l.id,
            'title', l.title,
            'lesson_order', l.lesson_order,
            'course', jsonb_build_object(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'requirements', c.requirements,
              'picture', c.requirements,
              'level', c.level,
              'instructor', jsonb_build_object(
                'id', i.id,
                'user_name', i.user_name,
                'email', i.email,
                'password', i.password,
                'profile_picture', i.profile_picture,
                'phone_number', i.phone_number,
                'address', i.address,
                'reset_password_token', i.reset_password_token,
                'title', i.title,
                'description', i.description
                )
              )
            ),
            'pricing_plan',  jsonb_build_object(
              'id', p.id,
              'plan_name', p.plan_name,
              'price', p.price,
              'attributes', p.attributes
           )
          ),
          'status', stp.status
      )) AS result 
      FROM student_progress stp JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.student_id = $1;
      `
      const studentProgress = await connection.query(sql, [student_id])
      connection.release();
      return studentProgress.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getStudentProgress(student_id: string, topic_id:string): Promise<StudentProgressModel>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT jsonb_agg(jsonb_build_object(
        'student', jsonb_build_object(
          'id', s.id,
          'user_name', s.user_name,
          'email', s.email,
          'password', s.password,
          'profile_picture', s.profile_picture,
          'phone_number', s.phone_number,
          'address', s.address,
          'reset_password_token', s.reset_password_token,
          'points', s.points
         ),
         'topic, jsonb_build_object(
          'id', t.id,
          'title', t.title,
          'description', t.description,
          'topic_order', t.topic_order,
          'points', t.points,
          'content_url', t.content_url,
          'topic_type', t.topic_type,
          'lesson', jsonb_build_object(
            'id', l.id,
            'title', l.title,
            'lesson_order', l.lesson_order,
            'course', jsonb_build_object(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'requirements', c.requirements,
              'picture', c.requirements,
              'level', c.level,
              'instructor', jsonb_build_object(
                'id', i.id,
                'user_name', i.user_name,
                'email', i.email,
                'password', i.password,
                'profile_picture', i.profile_picture,
                'phone_number', i.phone_number,
                'address', i.address,
                'reset_password_token', i.reset_password_token,
                'title', i.title,
                'description', i.description
                )
              )
            ),
            'pricing_plan',  jsonb_build_object(
              'id', p.id,
              'plan_name', p.plan_name,
              'price', p.price,
              'attributes', p.attributes
           )
          ),
          'status', stp.status
      )) AS result 
      FROM student_progress stp JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.student_id = $1 AND stp.topic_id = $2;
      `
      const studentProgress = await connection.query(sql, [student_id, topic_id])
      connection.release();
      return studentProgress.rows[0].result[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

}

export default StudentProgressDAO;