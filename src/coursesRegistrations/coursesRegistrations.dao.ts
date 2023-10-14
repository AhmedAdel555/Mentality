import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import CoursesRegistrationsModel from "./coursesRegistrations.model";
import AppError from "../utils/appError";
class CoursesRegistrationsDAO {

  public async createCourseResgistration(courseRegistration: CoursesRegistrationsModel): Promise<CoursesRegistrationsModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO courses_registration(student_id, course_id)
                  Values ($1, $2)
                  returning id,
                  (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = courses_registration.student_id) AS student,
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = courses_registration.course_id) AS course,
                  course_progress`;
      const newCourseRegistration = await connection.query(sql, [
        courseRegistration.student.id,
        courseRegistration.course.id
      ]);
      connection.release();
      return newCourseRegistration.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllCourseRegistrations(): Promise<CoursesRegistrationsModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id,
                  (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = courses_registration.student_id) AS student,
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = courses_registration.course_id) AS course,
                  course_progress 
                  FROM courses_registration;`;
      const courseRegistrations = await connection.query(sql);
      connection.release();
      return courseRegistrations.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // get one course
  public async getCourseRegistrationById(id: string): Promise<CoursesRegistrationsModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id,
                  (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = courses_registration.student_id) AS student,
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = courses_registration.course_id) AS course,
                  course_progress 
                  FROM courses_registration;
                  where id = $1;`;
      const courseRegistration = await connection.query(sql, [id]);
      connection.release();
      return courseRegistration.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateCourseRegistration(courseRegistration: CoursesRegistrationsModel): Promise<CoursesRegistrationsModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE courses_registration
                  SET course_progress = $1
                  WHERE id = $2
                  returning id,
                  (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = courses_registration.student_id) AS student,
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = courses_registration.course_id) AS course,
                  course_progress`;
      const updatedCourseRegistration = await connection.query(sql, [
        courseRegistration.course_progress,
        courseRegistration.id
      ]);
      connection.release();
      return updatedCourseRegistration.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // delete course
  public async deleteCourseRegistrationById(id: string): Promise<CoursesRegistrationsModel  | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM courses_registration WHERE id = $1 
      returning id,
      (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = courses_registration.student_id) AS student,
      (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = courses_registration.course_id) AS course,
      course_progress;`;
      const deletedCourseRegistration = await connection.query(sql, [id]);
      connection.release();
      return deletedCourseRegistration.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}
export default CoursesRegistrationsDAO;