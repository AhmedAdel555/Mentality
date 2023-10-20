import db from "../../utils/databaseConfig";
import { PoolClient } from "pg";
import AdminModel from "./admin.model";
import AppError from "../../utils/appError";
class AdminDAO {
  public async createAdmin(admin: AdminModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO admins (email, user_name, password, profile_picture)
        VALUES ($1, $2, $3, $4);`;
      await connection.query(sql, [
        admin.email,
        admin.user_name,
        admin.password,
        admin.profile_picture,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllAdmins(): Promise<AdminModel[]> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from admins;`;
      const admins = await connection.query(sql);
      connection.release();
      return admins.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAdminById(id: string): Promise<AdminModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from admins WHERE id = $1;`;
      const admin = await connection.query(sql, [id]);
      connection.release();
      return admin.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAdminByEmail(email: string): Promise<AdminModel | undefined> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from admins WHERE email = $1;`;
      const admin = await connection.query(sql, [email]);
      connection.release();
      return admin.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async updateAdmin(admin: AdminModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `UPDATE admins
        SET email = $1, user_name = $2, phone_number = $3, address = $4,
        password = $5, profile_picture = $6, reset_password_token = $7
        WHERE id = $8;`;
      await connection.query(sql, [
        admin.email,
        admin.user_name,
        admin.phone_number,
        admin.address,
        admin.password,
        admin.profile_picture,
        admin.reset_password_token,
        admin.id,
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }
}

export default AdminDAO;
