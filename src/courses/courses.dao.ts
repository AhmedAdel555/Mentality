import db from "../utils/databaseConfig";
import course from "./courses.model";
class CoursesDAO{

  public async createCourse(course: course){
      try{
        const connection = await db.connect();
        const sql = `INSERT INTO courses(tilte, description, instructor_id, level_id) 
                    Values ($1, $2, $3, $4)
                    returning id, tilte;
                    `;
        const newCourse = await connection.query(sql, [course.title, course.description, course.instructorId, course.levelId]);
        connection.release();
        return newCourse.rows[0];
      }catch(err){
        throw new Error((err as Error).message);
      }
  }
}

export default CoursesDAO;