import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import LessonModel from "./lesson.model";

class LessonDAO {

  public async createLesson(lesson: LessonModel): Promise<LessonModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO lessons(title, lesson_order, course_id)
                    Values ($1, $2, $3)
                    returning id, title, lesson_order, 
                    (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = lessons.course_id) AS course;`;
      const newLesson = await connection.query(sql, [
        lesson.title,
        lesson.lesson_order,
        lesson.course.id
      ]);
      connection.release();
      return newLesson.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getAllLessons(): Promise<LessonModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, title, lesson_order, 
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = lessons.course_id) AS course
                  FROM lessons;`;
      const lessons = await connection.query(sql);
      connection.release();
      return lessons.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getlessonById(id: string): Promise<LessonModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, title, lesson_order, 
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = lessons.course_id) AS course
                  FROM lessons
                  where id = $1;`;
      const lesson = await connection.query(sql, [id]);
      connection.release();
      return lesson.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateLesson(lesson: LessonModel): Promise<LessonModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();

      const sql = `UPDATE lessons
                  SET title = $1, lesson_order = $2
                  WHERE id = $3
                  returning id, title, lesson_order, 
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = lessons.course_id) AS course;`;
      const updatedLesson = await connection.query(sql, [
          lesson.title,
          lesson.lesson_order
      ]);
      connection.release();
      return updatedLesson.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deleteLessonById(id: string): Promise<LessonModel  | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM lessons WHERE id = $1 
                  returning id, title, lesson_order, 
                  (SELECT ROW_TO_JSON(courses) FROM courses WHERE courses.id = lessons.course_id) AS course;`;
      const deletedLesson = await connection.query(sql, [id]);
      connection.release();
      return deletedLesson.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default LessonDAO;