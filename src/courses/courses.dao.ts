import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import CourseModel from "./course.model";
import AppError from "../utils/appError";
class CoursesDAO {

  public async createCourse(course: CourseModel): Promise<CourseModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO courses(title, description, instructor_id, level, requirements, picture)
                    Values ($1, $2, $3, $4, $5, $6)
                    returning id, title, description, requirements, picture, level, 
                  (SELECT ROW_TO_JSON(instructors) FROM instructors WHERE instructors.id = courses.instructor_id) AS instructor;`;
      const newCourse = await connection.query(sql, [
        course.title,
        course.description,
        course.instructor.id,
        course.level,
        course.requirements,
        course.picture,
      ]);
      connection.release();
      return newCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getAllCourses(): Promise<CourseModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, title, description, requirements, picture, level, 
                  (SELECT ROW_TO_JSON(instructors) FROM instructors WHERE instructors.id = courses.instructor_id) AS instructor 
                  FROM courses;`;
      const courses = await connection.query(sql);
      connection.release();
      return courses.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // get one course
  public async getCourseById(id: string): Promise<CourseModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, title, description, requirements, picture, level, 
      (SELECT ROW_TO_JSON(instructors) FROM instructors WHERE instructors.id = courses.instructor_id) AS instructor 
      FROM courses
      where id = $1;`;
      const course = await connection.query(sql, [id]);
      connection.release();
      return course.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateCourse(course: CourseModel): Promise<CourseModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      console.log(course.id);
      const sql = `UPDATE courses
                  SET title = $1, description = $2, requirements = $3, 
                  level = $4 , picture = $5
                  WHERE id = $6
                  returning id, title, description, requirements, picture, level, 
                  (SELECT ROW_TO_JSON(instructors) FROM instructors WHERE instructors.id = courses.instructor_id) AS instructor;`;
      const updatedCourse = await connection.query(sql, [
        course.title,
        course.description,
        course.requirements,
        course.level,
        course.picture,
        course.id,
      ]);
      connection.release();
      return updatedCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // delete course
  public async deleteCourseById(id: string): Promise<CourseModel  | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM courses WHERE id = $1 
      returning id, title, description, requirements, picture, level, 
      (SELECT ROW_TO_JSON(instructors) FROM instructors WHERE instructors.id = courses.instructor_id) AS instructor;`;
      const deletedCourse = await connection.query(sql, [id]);
      connection.release();
      return deletedCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default CoursesDAO;
