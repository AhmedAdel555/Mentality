import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import course from "./courses.model";
class CoursesDAO{

  // add course
  public async createCourse(course: course): Promise<course>{
      let connection: PoolClient | null = null;
      try{
        connection = await db.connect();
        const sql = `INSERT INTO courses(tilte, description, instructor_id, level_id) 
                    Values ($1, $2, $3, $4)
                    returning *;
                    `;
        const newCourse = await connection.query(sql, [course.title, course.description, course.instructorId, course.levelId]);
        connection.release();
        return newCourse.rows[0];
      }catch(err){
        if(connection) connection.release()
        throw new Error((err as Error).message);
      }
  }

  // get all courses
  public async getAllCourses(): Promise<course[]>{
    let connection: PoolClient | null = null;
    try{
      connection = await db.connect();
      const sql = `SELECT * FROM courses;`;
      const courses = await connection.query(sql);
      connection.release();
      return courses.rows;
    }catch(err){
      if(connection) connection.release()
      throw new Error((err as Error).message);
    }
  }

  // get one course
  public async getCourse(id:string): Promise<course>{
    let connection: PoolClient | null = null;
    try{
      connection = await db.connect();
      const sql = `SELECT * FROM courses WHERE id = $1;`;
      const course = await connection.query(sql, [id]);
      connection.release();
      return course.rows[0];
    }catch(err){
      if(connection) connection.release()
      throw new Error((err as Error).message);
    }
  }

  // update course
  public async updateCourse(course: course): Promise<course>{
    let connection: PoolClient | null = null;
    try{
      connection = await db.connect();
      console.log(course.id);
      const sql = `UPDATE courses
                  SET tilte = $1, description = $2, instructor_id = $3, level_id = $4
                  WHERE id = $5
                  returning * ;`;
      const updatedCourse = await connection.query(sql, [course.title, course.description, course.instructorId, course.levelId, course.id]);
      connection.release();
      return updatedCourse.rows[0];
    }catch(err){
      if(connection) connection.release()
      throw new Error((err as Error).message);
    }
  }
  // delete course
  public async deleteCourse(id:string): Promise<course>{
    let connection: PoolClient | null = null;
    try{
      connection = await db.connect();
      const sql = `DELETE FROM courses WHERE id = $1 returning *;`;
      const deletedCourse = await connection.query(sql, [id]);
      connection.release();
      return deletedCourse.rows[0];
    }catch(err){
      if(connection) connection.release()
      throw new Error((err as Error).message);
    }
  }
}

export default CoursesDAO;