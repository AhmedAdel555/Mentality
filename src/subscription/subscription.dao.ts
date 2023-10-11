import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import SubscriptionModel from "./subscription.model";
import AppError from "../utils/appError";

class SubscriptionDAO{

  public async createSubscription(subscription: SubscriptionModel): Promise<SubscriptionModel>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO subscriptions (student_id, pricing_plan_id, date)
      VALUES ($1, $2, DATE $3)
      returning id, (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = subscriptions.student_id) AS student,
      (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = subscriptions.pricing_plan_id) AS pricing_plan,
      date ;`;
      const newSubscription = await connection.query(sql, [
        subscription.student.id,
        subscription.pricing_plan.id,
        subscription.date.toISOString().split('T')[0]
      ]);
      connection.release();
      return newSubscription.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllSubscriptions(): Promise<SubscriptionModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = subscriptions.students_id) AS student,
      (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = subscriptions.pricing_plan_id) AS pricing_plan, date 
      FROM subscriptions
      ORDER BY date;`;
      const subscriptions = await connection.query(sql);
      connection.release();
      return subscriptions.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getSubscriptionById(id: string): Promise<SubscriptionModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = subscriptions.students_id) AS student,
      (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = subscriptions.pricing_plan_id) AS pricing_plan, date  
      FROM subscriptions
      WHERE id = $1;`;
      const subscription = await connection.query(sql, [id]);
      connection.release();
      return subscription.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deleteSubscriptionById(id: string): Promise<SubscriptionModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM subscriptions 
      WHERE id = $1 
      returning id, (SELECT ROW_TO_JSON(students) FROM students WHERE students.id = subscriptions.students_id) AS student,
      (SELECT ROW_TO_JSON(pricing_plans) FROM pricing_plans WHERE pricing_plans.id = subscriptions.pricing_plan_id) AS pricing_plan,
      date  ;`;
      const deletedSubscription = await connection.query(sql, [id]);
      connection.release();
      return deletedSubscription.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default SubscriptionDAO;