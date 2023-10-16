import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import AppError from "../utils/appError";
import TopicModel from "./topic.model";
class TopicDAO {
  public async createTopic(topic: TopicModel): Promise<TopicModel> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO topics(title, description, topic_order, points, lesson_id, pricing_plan_id, content_url, topic_type)
                    Values ($1, $2, $3, $4, $5, $6, $7, $8)
                    returning id, title, description, topic_order, points, content_url, topic_type,
                    (SELECT ROW_TO_JSON(lessons) FROM lessons WHERE lessons.id = topics.lesson_id) AS lesson,
                    (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = topics.pricing_plan_id) AS pricing_plan;`;
      const newTopic = await connection.query(sql, [
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
      return newTopic.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getAllTopics(): Promise<TopicModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT  id, title, description, topic_order, points, content_url, topic_type,
                  (SELECT ROW_TO_JSON(lessons) FROM lessons WHERE lessons.id = topics.lesson_id) AS lesson,
                  (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = topics.pricing_plan_id) AS pricing_plan 
                  FROM topics;`;
      const topics = await connection.query(sql);
      connection.release();
      return topics.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getTopicById(id: string): Promise<TopicModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT  id, title, description, topic_order, points, content_url, topic_type,
                  (SELECT ROW_TO_JSON(lessons) FROM lessons WHERE lessons.id = topics.lesson_id) AS lesson,
                  (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = topics.pricing_plan_id) AS pricing_plan 
                  FROM topics
                  where id = $1;`;
      const topic = await connection.query(sql, [id]);
      connection.release();
      return topic.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  // update course
  public async updateTopic(topic: TopicModel): Promise<TopicModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();

      const sql = `UPDATE topics
                  SET  title = $1, description = $2, topic_order = $3, 
                  points = $4, content_url = $5, topic_type = $6,
                  lesson_id = $7, pricing_plan_id = $8
                  WHERE id = $9
                  returning  id, title, description, topic_order, points, content_url, topic_type,
                  (SELECT ROW_TO_JSON(lessons) FROM lessons WHERE lessons.id = topics.lesson_id) AS lesson,
                  (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = topics.pricing_plan_id) AS pricing_plan;`;
      const updatedTopic = await connection.query(sql, [
          topic.title, topic.description, topic.topic_order, topic.points,
          topic.content_url, topic.topic_type, topic.lesson.id, topic.pricing_plan.id,
          topic.id
      ]);
      connection.release();
      return updatedTopic.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deleteTopicById(id: string): Promise<TopicModel  | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM topics WHERE id = $1 
      returning  id, title, description, topic_order, points, content_url, topic_type,
      (SELECT ROW_TO_JSON(lessons) FROM lessons WHERE lessons.id = topics.lesson_id) AS lesson,
      (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = topics.pricing_plan_id) AS pricing_plan;`;
      const deletedTopic = await connection.query(sql, [id]);
      connection.release();
      return deletedTopic.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}
export default TopicDAO;