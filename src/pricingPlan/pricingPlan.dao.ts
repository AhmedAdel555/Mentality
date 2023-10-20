import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import PricingPlanModel from "./pricingPlan.model";
import AppError from "../utils/appError";

class PricingPlanDAO {

  public async createPricingPlan(pricingPlan: PricingPlanModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO pricing_plans (plan_name, price, attributes)
        VALUES ($1, $2, $3);`;
      await connection.query(sql, [
        pricingPlan.plan_name,
        pricingPlan.price,
        pricingPlan.attributes,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async getAllPricingPlans(): Promise<PricingPlanModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * FROM pricing_plans`;
      const pricingPlans = await connection.query(sql);
      connection.release();
      return pricingPlans.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getPricingPlanById(id: number): Promise<PricingPlanModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * FROM pricing_plans WHERE id = $1`;
      const pricingPlan = await connection.query(sql, [id]);
      connection.release();
      return pricingPlan.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updatePricingPlan(pricingPlan: PricingPlanModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE pricing_plans
        SET plan_name = $1, price = $2, attributes = $3
        WHERE id = $4;`;
      await connection.query(sql, [
        pricingPlan.plan_name,
        pricingPlan.price,
        pricingPlan.attributes,
        pricingPlan.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async deletePricingPlanById(id: number): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM pricing_plans WHERE id = $1 RETURNING *;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default PricingPlanDAO;