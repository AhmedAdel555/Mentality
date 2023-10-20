import { PoolClient } from "pg";
import db from "../../utils/databaseConfig";
import StudentModel from "./student.model";
import AppError from "../../utils/appError";
class StudentDAO {

  public async createStudent(student: StudentModel): Promise<void> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO students (email, user_name, password, profile_picture, points)
        VALUES ($1, $2, $3, $4, $5);`;
      await connection.query(sql, [
        student.email,
        student.user_name,
        student.password,
        student.profile_picture,
        student.points
      ]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getAllStudents(): Promise<StudentModel[]>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from students`;
      const students = await connection.query(sql);
      connection.release();
      return students.rows;
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
    }
  }

  public async getStudentById(id:string): Promise<StudentModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from students WHERE id = $1`;
      const student = await connection.query(sql, [id]);
      connection.release();
      return student.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);    }
  }

  public async getStudentByEmail(email:string): Promise<StudentModel | undefined>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT * from students WHERE email = $1`;
      const student = await connection.query(sql, [email]);
      connection.release();
      return student.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);    }
  }

  public async updateStudent(student: StudentModel): Promise<void>{
    let connection: PoolClient | null = null;
      try {
        connection = await db.connect();
        const sql = `UPDATE students
        SET email = $1, user_name = $2, phone_number = $3, 
        address = $4, password = $5, profile_picture = $6,
        reset_password_token = $7, points = $8
        WHERE id = $9;`;
        await connection.query(sql, 
          [student.email, student.user_name, student.phone_number, student.address, student.password,
           student.profile_picture, student.reset_password_token, student.points, student.id]);
        connection.release();
      } catch (err) {
        if (connection) connection.release();
        throw new AppError((err as Error).message, 500);
            }
  }

  public async deleteStudentById(id:string): Promise<void>{
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `DELETE FROM students WHERE id = $1 ;`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      if (connection) connection.release();
      throw new AppError((err as Error).message, 500);
        }
  }
}
export default StudentDAO;