import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import CourseModel from "./courses.model";
import AllCoursesDataRespose from "./dtos/all-courses-data-respose";
import ReturnedCourseDBDTO from "./dtos/returned-course-db-dto";
class CoursesDAO {
  // add course
  public async createCourse(course: CourseModel): Promise<CourseModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO courses(title, description, instructor_id, level_id, requirements, picture)
                    Values ($1, $2, $3, (SELECT id from levels where level_name = $4), $5, $6)
                    returning id, title, description, instructor_id, (SELECT level_name from levels where id = level_id), requirements, picture;`;
      const newCourse = await connection.query(sql, [
        course.title,
        course.description,
        course.instructor_id,
        course.level,
        course.requirements,
        course.picture,
      ]);
      connection.release();
      return newCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  // get all courses
  public async getAllCourses(): Promise<AllCoursesDataRespose[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, title, picture FROM courses;`;
      const courses = await connection.query(sql);
      connection.release();
      return courses.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  // get one course
  public async getCourse(id: string): Promise<ReturnedCourseDBDTO> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT courses.id, courses.title, courses.description, courses.requirements, courses.picture ,levels.level_name, 
      instructors.id as instructor_id, instructors.user_name as instructor_user_name, instructors.title as instructor_title ,instructors.description as instructor_description, instructors.profile_picture as instructor_profile_picture
      FROM courses JOIN levels ON courses.level_id = levels.id
      JOIN instructors ON courses.instructor_id = instructors.id
      where courses.id = $1;`;
      const course = await connection.query(sql, [id]);
      connection.release();
      return course.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  // update course
  public async updateCourse(course: CourseModel): Promise<CourseModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      console.log(course.id);
      const sql = `UPDATE courses
                  SET tilte = $1, description = $2, instructor_id = $3, 
                  level_id = (SELECT id from levels where level_name = $4), requirements = $5
                  WHERE id = $6
                  returning id, title, description, instructor_id, (SELECT level_name from levels where id = level_id), requirements, picture;`;
      const updatedCourse = await connection.query(sql, [
        course.title,
        course.description,
        course.instructor_id,
        course.level,
        course.requirements,
        course.id,
      ]);
      connection.release();
      return updatedCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }
  // delete course
  public async deleteCourse(id: string): Promise<CourseModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM courses WHERE id = $1 
      returning id, title, description, instructor_id, (SELECT level_name from levels where id = level_id), requirements, picture;`;
      const deletedCourse = await connection.query(sql, [id]);
      connection.release();
      return deletedCourse.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }
}

export default CoursesDAO;
