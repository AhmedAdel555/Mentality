import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import SubscriptionModel from "./subscription.model";
import AppError from "../utils/appError";

class SubscriptionDAO{

  public async createSubscription(subscription: SubscriptionModel): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO subscriptions (student_id, pricing_plan_id, date)
      VALUES ($1, $2, $3);`;
      await connection.query(sql, [
        subscription.student.id,
        subscription.pricing_plan.id,
        subscription.date.toISOString().split('T')[0]
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllSubscriptions(): Promise<SubscriptionModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
        SELECT jsonb_agg(jsonb_build_object(
          'id', sp.id,
          'date', sp.date,
          'student', jsonb_build_object(
            'id', s.id,
            'user_name', s.user_name,
            'email', s.email,
            'password', s.password,
            'profile_picture', s.profile_picture,
            'phone_number', s.phone_number,
            'address', s.address,
            'reset_password_token', s.reset_password_token,
            'points', s.points
           ),
           'pricing_plan',  jsonb_build_object(
              'id', p.id,
              'plan_name', p.plan_name,
              'price', p.price,
              'attributes', p.attributes
           )
        )) AS result 
        FROM subscriptions sp JOIN students s ON sp.student_id = s.id
        JOIN pricing_plans p ON sp.pricing_plan_id = p.id
        ORDER BY sp.date;
      `;

      const subscriptions = await connection.query(sql);
      connection.release();
      return subscriptions.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getSubscriptionById(id: string): Promise<SubscriptionModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `    SELECT jsonb_agg(jsonb_build_object(
        'id', sp.id,
        'date', sp.date,
        'student', jsonb_build_object(
          'id', s.id,
          'user_name', s.user_name,
          'email', s.email,
          'password', s.password,
          'profile_picture', s.profile_picture,
          'phone_number', s.phone_number,
          'address', s.address,
          'reset_password_token', s.reset_password_token,
          'points', s.points
         ),
         'pricing_plan',  jsonb_build_object(
            'id', p.id,
            'plan_name', p.plan_name,
            'price', p.price,
            'attributes', p.attributes
         )
      )) AS result 
      FROM subscriptions sp JOIN students s ON sp.student_id = s.id
      JOIN pricing_plans p ON sp.pricing_plan_id = p.id
      WHERE sp.id = $1;`;
      const subscription = await connection.query(sql, [id]);
      connection.release();
      return subscription.rows[0].result[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getStudentSubscriptions(studentId: string): Promise<SubscriptionModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `
        SELECT jsonb_agg(jsonb_build_object(
          'id', sp.id,
          'date', sp.date,
          'student', jsonb_build_object(
            'id', s.id,
            'user_name', s.user_name,
            'email', s.email,
            'password', s.password,
            'profile_picture', s.profile_picture,
            'phone_number', s.phone_number,
            'address', s.address,
            'reset_password_token', s.reset_password_token,
            'points', s.points
           ),
           'pricing_plan',  jsonb_build_object(
              'id', p.id,
              'plan_name', p.plan_name,
              'price', p.price,
              'attributes', p.attributes
           )
        )) AS result 
        FROM subscriptions sp JOIN students s ON sp.student_id = s.id
        JOIN pricing_plans p ON sp.pricing_plan_id = p.id
        WHERE sp.student_id = $1
        ORDER BY sp.date;
      `;

      const subscriptions = await connection.query(sql, [studentId]);
      connection.release();
      return subscriptions.rows[0].result;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async deleteSubscriptionById(id: string): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM subscriptions WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default SubscriptionDAO;