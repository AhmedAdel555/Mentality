import LoginRequestDto from "./dtos/login-request-dto";
import db from "../utils/databaseConfig";
import { PoolClient } from "pg";
import userAuthDTO from "./dtos/user-auth-dto";
import StudentRegisterDataDto from "./dtos/student-reister-data-dto";

class AuthDAO {
  public async login(data: LoginRequestDto): Promise<userAuthDTO> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, email, password from ${data.role} WHERE email = $1;`;
      const user = await connection.query(sql, [data.email]);
      connection.release();
      return user.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  public async register(data: StudentRegisterDataDto): Promise<userAuthDTO> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `INSERT INTO students (user_name , email, password, profile_picture) 
                    VALUES ($1, $2, $3, $4)
                    returning id, email, password;`;
      const student = await connection.query(sql, [
        data.userName,
        data.email,
        data.password,
        data.avatar,
      ]);
      connection.release();
      return student.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }

  public async getUserByEmail(email: string): Promise<userAuthDTO> {
    let connection: PoolClient | null = null;
    try {
      connection = await db.connect();
      const sql = `SELECT id, email, password from students WHERE email = $1;`;
      const student = await connection.query(sql, [email]);
      connection.release();
      return student.rows[0];
    } catch (err) {
      if (connection) connection.release();
      throw new Error((err as Error).message);
    }
  }
}

export default AuthDAO;
