import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import StudentProgressModel from "./studentProgress.model";
import StatusProgress from "./statusProgress.enum";

class StudentProgressDAO {

  private readonly map_student_progress_object = `
  jsonb_agg(
    jsonb_build_object(
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
      'topic', jsonb_build_object(
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
            'picture', c.picture,
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
        'pricing_plan', jsonb_build_object(
          'id', p.id,
          'plan_name', p.plan_name,
          'price', p.price,
          'attributes', p.attributes
        )
      ),
      'status', stp.status,
      'grade', stp.grade,
      'solution', stp.solution
    )
  ) AS result 
  `

  public async addTopicToProgress(courseId:string, TopicId:string): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT add_topic_to_progress($1, $2);`;
      await connection.query(sql, [
        courseId,
        TopicId
      ]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

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
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updateStudentProgress(studentProgress: StudentProgressModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE student_progress 
                  SET status = $1, grade = $2, solution = $3
                  WHERE student_id = $4 AND topic_id = $5;`;
      await connection.query(sql, [
         studentProgress.status,
         studentProgress.grade,
         studentProgress.solution,
         studentProgress.student.id,
         studentProgress.topic.id
      ]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getSumOfStudentGrades(studentId: string): Promise<number> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT COALESCE(SUM(grade),0) AS total_grades FROM student_progress WHERE student_id = $1;`;
      const result = await connection.query(sql, [studentId]);
      connection.release();
      return parseInt(result.rows[0].total_grades);
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllStudentLessonProgress(studentId: string, lessonId: string): Promise<StudentProgressModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_student_progress_object}
      FROM student_progress stp 
      JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id 
      JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.student_id = $1 AND l.id = $2;
      `
      const studentProgress = await connection.query(sql, [studentId, lessonId]);
      connection.release();
      return studentProgress.rows[0].result === null ? [] : studentProgress.rows[0].result;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllStudentCourseProgress(studentId: string, courseId: string): Promise<StudentProgressModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_student_progress_object}
      FROM student_progress stp 
      JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id 
      JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.student_id = $1 AND c.id = $2;
      `
      const studentProgress = await connection.query(sql, [studentId, courseId]);
      connection.release();

      return studentProgress.rows[0].result === null ? [] : studentProgress.rows[0].result;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllPendingTasksCourseProgress(courseId: string): Promise<StudentProgressModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_student_progress_object}
      FROM student_progress stp 
      JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id 
      JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.status = $1 AND c.id = $2;
      `
      const studentProgress = await connection.query(sql, [StatusProgress.PENDING, courseId]);
      connection.release();
      return studentProgress.rows[0].result === null ? [] : studentProgress.rows[0].result;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getStudentProgress(student_id: string, topic_id:string): Promise<StudentProgressModel>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_student_progress_object}
      FROM student_progress stp 
      JOIN students s ON stp.student_id = s.id
      JOIN topics t ON stp.topic_id = t.id 
      JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE stp.student_id = $1 AND stp.topic_id = $2;
      `
      const studentProgress = await connection.query(sql, [student_id, topic_id])
      connection.release();
      return studentProgress.rows[0].result === null ? undefined : studentProgress.rows[0].result[0];
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default StudentProgressDAO;