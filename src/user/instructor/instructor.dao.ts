import { PoolClient } from "pg";
import db from "../utils/databaseConfig";
import InstructorModel from "./instructor.model";

class InstructorDAO {
  public async create(instructor: InstructorModel): Promise<InstructorModel>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO instructors (user_name, email, password, title, description, profile_picture)
        VALUES ($1, $2, $3, $4, $5, $6)
        returning id, user_name, email, password, title, description, profile_picture`;
      const newInstructor = await connection.query(sql, [
        instructor.user_name,
        instructor.email,
        instructor.password,
        instructor.title,
        instructor.description,
        instructor.profile_picture
      ]);
      connection.release();
      return newInstructor.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  public async getAll() : Promise<InstructorModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from instructors`;
      const instructors = await connection.query(sql);
      connection.release();
      return instructors.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  public async getById(id: string): Promise<InstructorModel>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from instructors WHERE id = $1`;
      const instructors = await connection.query(sql, [id]);
      connection.release();
      return instructors.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }


  public async update(instructor: InstructorModel): Promise<InstructorModel>{
    let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `UPDATE instructors
        SET email = $1, user_name = $2, phone_number = $3, address = $4 , title = $5 , description = $6
        WHERE id = $7
        returning *;`;
        const updatedInstructor = await connection.query(sql, 
          [instructor.email, instructor.user_name, instructor.phone_number,
           instructor.address, instructor.title, instructor.description, instructor.id]);
        connection.release();
        return updatedInstructor.rows[0];
      } catch (err) {
        if (connection) connection.release();
        throw new Error((err as Error).message);
      }
  }
}

export default InstructorDAO;