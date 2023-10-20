import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import LessonModel from "./lesson.model";

class LessonDAO {
  public async createLesson(lesson: LessonModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO lessons(title, lesson_order, course_id)
                    Values ($1, $2, $3);`;
      await connection.query(sql, [
        lesson.title,
        lesson.lesson_order,
        lesson.course.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllLessons(): Promise<LessonModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = ` SELECT jsonb_agg(jsonb_build_object(
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
      )) AS result 
      FROM lessons l JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id ;
      `;

      const lessons = await connection.query(sql);
      connection.release();
      return lessons.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getlessonById(id: string): Promise<LessonModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = ` SELECT jsonb_agg(jsonb_build_object(
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
      )) AS result 
      FROM lessons l JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id
      where l.id = $1;`;
      const lesson = await connection.query(sql, [id]);
      connection.release();
      return lesson.rows[0].result[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateLesson(lesson: LessonModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE lessons
                  SET title = $1, lesson_order = $2
                  WHERE id = $3;`;
      await connection.query(sql, [
        lesson.title,
        lesson.lesson_order,
        lesson.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deleteLessonById(id: string): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM lessons WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default LessonDAO;
