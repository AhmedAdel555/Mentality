import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import CoursesRegistrationsModel from "./coursesRegistrations.model";
import AppError from "../utils/appError";
class CoursesRegistrationsDAO {

  private readonly map_course_registeration_object = `
  jsonb_agg(
    jsonb_build_object(
      'id', cr.id,
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
      ),
      'course_progress', cr.course_progress
    )
  ) AS result
  `

  public async createCourseResgistration(
    courseRegistration: CoursesRegistrationsModel
  ): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO courses_registration(student_id, course_id)
                  Values ($1, $2);`;
      await connection.query(sql, [
        courseRegistration.student.id,
        courseRegistration.course.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getCourseRegistrationsForCourse(courseId: string): Promise<
    CoursesRegistrationsModel[]
  > {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT ${this.map_course_registeration_object}
      FROM courses_registration cr JOIN students s ON cr.student_id = s.id 
      JOIN courses c ON cr.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      WHERE cr.course_id = $1;`;
      const courseRegistrations = await connection.query(sql, [courseId]);
      connection.release();
      return courseRegistrations.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getCourseRegistrationsForStudent(studentId: string): Promise<
  CoursesRegistrationsModel[]
> {
  let connection: PoolClient | null = null;
  try {
    connection = await db.connect();
    const sql = `SELECT ${this.map_course_registeration_object}
    FROM courses_registration cr JOIN students s ON cr.student_id = s.id 
    JOIN courses c ON cr.course_id = c.id
    JOIN instructors i ON c.instructor_id = i.id 
    WHERE cr.student_id = $1;`;
    const courseRegistrations = await connection.query(sql, [studentId]);
    connection.release();
    return courseRegistrations.rows[0].result;
  } catch (err) {
    if (connection) connection.release();
    throw new AppError((err as Error).message, 500);
  }
}

  public async getCourseRegistrationById(
    id: string
  ): Promise<CoursesRegistrationsModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql =`SELECT ${this.map_course_registeration_object}
      FROM courses_registration cr JOIN students s ON cr.student_id = s.id 
      JOIN courses c ON cr.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      WHERE cr.id = $1;`;
      const courseRegistration = await connection.query(sql, [id]);
      connection.release();
      return courseRegistration.rows[0].result[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getCourseRegistration(
    course_id: string, student_id:string
  ): Promise<CoursesRegistrationsModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT ${this.map_course_registeration_object}
      FROM courses_registration cr JOIN students s ON cr.student_id = s.id 
      JOIN courses c ON cr.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      WHERE cr.course_id = $1 AND cr.student_id = $2;`;
      const courseRegistration = await connection.query(sql, [course_id, student_id]);
      connection.release();
      return courseRegistration.rows[0].result[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updateCourseRegistration(
    courseRegistration: CoursesRegistrationsModel
  ): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE courses_registration
                   SET course_progress = $1
                   WHERE id = $2;`;
      await connection.query(sql, [
        courseRegistration.course_progress,
        courseRegistration.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}
export default CoursesRegistrationsDAO;
