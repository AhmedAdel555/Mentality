import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import TopicModel from "./topic.model";
class TopicDAO {

  private readonly map_topic_object = 
  `jsonb_agg(
    jsonb_build_object(
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
    )
  ) AS result 
  `

  public async createTopic(topic: TopicModel): Promise<string> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO topics(title, description, topic_order, points, lesson_id, pricing_plan_id, content_url, topic_type)
                    Values ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id`;
      const id = await connection.query(sql, [
          topic.title,
          topic.description,
          topic.topic_order,
          topic.points,
          topic.lesson.id,
          topic.pricing_plan.id,
          topic.content_url,
          topic.topic_type
      ]);
      connection.release();
      return id.rows[0].id
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllLessonTopics(LessonId:string): Promise<TopicModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
      SELECT ${this.map_topic_object}
      FROM topics t JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE t.lesson_id = $1
      `
      const topics = await connection.query(sql, [LessonId]);
      connection.release();
      return topics.rows[0].result === null ? [] : topics.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async countLessonTopics(lessonId: string): Promise<number>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT COUNT(*) from topics WHERE lesson_id = $1`
      const countTopics = await connection.query(sql, [lessonId]);
      connection.release();
      return parseInt(countTopics.rows[0].count);;
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getTopicById(id: string): Promise<TopicModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `  SELECT ${this.map_topic_object}
      FROM topics t JOIN lessons l ON t.lesson_id = l.id 
      JOIN courses c ON l.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN pricing_plans p ON t.pricing_plan_id = p.id
      WHERE t.id = $1;`;
      const topic = await connection.query(sql, [id]);
      connection.release();
      return topic.rows[0].result === null ? undefined :  topic.rows[0].result[0];
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updateTopic(topic: TopicModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE topics
                  SET  title = $1, description = $2, topic_order = $3, 
                  points = $4, content_url = $5, topic_type = $6,
                  lesson_id = $7, pricing_plan_id = $8
                  WHERE id = $9;`;
      await connection.query(sql, [
          topic.title, topic.description, topic.topic_order, topic.points,
          topic.content_url, topic.topic_type, topic.lesson.id, topic.pricing_plan.id,
          topic.id
      ]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deleteTopicById(id: string): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM topics WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }
}
export default TopicDAO;