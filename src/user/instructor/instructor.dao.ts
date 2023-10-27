import { PoolClient } from "pg";
import db from "../../utils/databaseConfig";
import InstructorModel from "./instructor.model";
import AppError from "../../utils/appError";

class InstructorDAO {

  public async createInstructor(instructor: InstructorModel): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO instructors (user_name, email, password, title, description, profile_picture)
        VALUES ($1, $2, $3, $4, $5, $6);`;
      await connection.query(sql, [
        instructor.user_name,
        instructor.email,
        instructor.password,
        instructor.title,
        instructor.description,
        instructor.profile_picture
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllInstructors() : Promise<InstructorModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from instructors`;
      const instructors = await connection.query(sql);
      connection.release();
      console.log(instructors)
      return instructors.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getInstructorById(id: string): Promise<InstructorModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from instructors WHERE id = $1`;
      const instructor = await connection.query(sql, [id]);
      connection.release();
      console.log(instructor)
      return instructor.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getInstructorByEmail(email: string): Promise<InstructorModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from instructors WHERE email = $1`;
      const instructor = await connection.query(sql, [email]);
      connection.release();
      return instructor.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }


  public async updateInstructor(instructor: InstructorModel): Promise<void>{
    let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `UPDATE instructors
        SET email = $1, user_name = $2, phone_number = $3, address = $4 , title = $5 , description = $6,
        password = $7, profile_picture = $8, reset_password_token = $9
        WHERE id = $10;`;
        await connection.query(sql, 
          [instructor.email, instructor.user_name, instructor.phone_number,instructor.address, instructor.title, 
          instructor.description, instructor.password, instructor.profile_picture, instructor.reset_password_token,
          instructor.id]);
        connection.release();
      } catch (err) {
        if (connection) connection.release();
        throw new AppError((err as Error).message, 500);
      }
  }

  public async deleteInstructorById(id:string): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM instructors WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }
}

export default InstructorDAO;