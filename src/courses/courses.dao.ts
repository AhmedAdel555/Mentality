import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import CourseModel from "./course.model";
import AppError from "../utils/appError";
class CoursesDAO {
  private readonly map_course_object: string = `
  jsonb_agg(
    jsonb_build_object(
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
  ) AS result
  `;

  public async createCourse(course: CourseModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO courses(title, description, instructor_id, level, requirements, picture)
                    Values ($1, $2, $3, $4, $5, $6);`;
      await connection.query(sql, [
        course.title,
        course.description,
        course.instructor.id,
        course.level,
        course.requirements,
        course.picture,
      ]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllCourses(): Promise<CourseModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_course_object}
      FROM courses c 
      JOIN instructors i ON c.instructor_id = i.id
      `;
      const courses = await connection.query(sql);
      connection.release();
      return  courses.rows[0].result === null ? [] : courses.rows[0].result;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getInstructorCourses(
    instructorId: string
  ): Promise<CourseModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_course_object}
      FROM courses c 
      JOIN instructors i ON c.instructor_id = i.id
      WHERE c.instructor_id = $1;
      `;
      const instructorCourses = await connection.query(sql, [instructorId]);
      connection.release();
      return instructorCourses.rows[0].result === null ? [] : instructorCourses.rows[0].result;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  // get one course
  public async getCourseById(id: string): Promise<CourseModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT ${this.map_course_object}
      FROM courses c 
      JOIN instructors i ON c.instructor_id = i.id
      where c.id = $1;`;
      const course = await connection.query(sql, [id]);
      connection.release();
      return course.rows[0].result === null ? undefined : course.rows[0].result[0];
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateCourse(course: CourseModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE courses
                  SET title = $1, description = $2, requirements = $3, 
                  level = $4 , picture = $5
                  WHERE id = $6 ;`;
      await connection.query(sql, [
        course.title,
        course.description,
        course.requirements,
        course.level,
        course.picture,
        course.id,
      ]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  // delete course
  public async deleteCourseById(id: string): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM courses WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default CoursesDAO;
