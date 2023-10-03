import db from "../../utils/databaseConfig";
import { PoolClient } from "pg";
import AdminModel from "./admin.model";
class AdminDAO{

    public async addAdmin(admin: AdminModel): Promise<AdminModel>{
      let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `INSERT INTO admins (email, user_name, password, profile_picture)
        VALUES ($1, $2, $3, $4)
        returning id, email, user_name, password, profile_picture`;
        const newAdmin = await connection.query(sql, [admin.email, admin.user_name, admin.password, admin.profile_picture]);
        connection.release();
        return newAdmin.rows[0];
      } catch (err) {
        if (connection) connection.release();
        throw new Error((err as Error).message);
      }
    }

    public async getAllAdmins(): Promise<AdminModel[]>{
      let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `SELECT id, email, user_name, password, profile_picture from admins;`;
        const admins = await connection.query(sql);
        connection.release();
        return admins.rows;
      } catch (err) {
        if (connection) connection.release();
        throw new Error((err as Error).message);
      }
    }

    public async getAdminById(id:string): Promise<AdminModel>{
      let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `SELECT * from admins WHERE id = $1;`;
        const admin = await connection.query(sql, [id]);
        connection.release();
        return admin.rows[0];
      } catch (err) {
        if (connection) connection.release();
        throw new Error((err as Error).message);
      }
    }

    public async updateAdmin(admin: AdminModel): Promise<AdminModel>{
      let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `UPDATE admins
        SET email = $1, user_name = $2, phone_number = $3, address = $4 
        WHERE id = $5
        returning id, email, user_name, password, profile_picture, phone_number, address;`;
        const updatedAdmin = await connection.query(sql, 
          [admin.email, admin.user_name, admin.phone_number, admin.address, admin.id]);
        connection.release();
        return updatedAdmin.rows[0];
      } catch (err) {
        if (connection) connection.release();
        throw new Error((err as Error).message);
      }
    }
}

export default AdminDAO;