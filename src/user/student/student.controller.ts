import { Request, Response,  NextFunction } from "express";
import StudentService from "./student.service";
import StudentDAO from "./student.dao";
import CoursesRegistrationsDAO from "../../coursesRegistrations/coursesRegistrations.dao";

class StudentController{
  constructor(private readonly studentService: StudentService){};

  public async getAllStudents(req: Request , res: Response, next: NextFunction){
      try{
        const students = await this.studentService.getAllStudents();
        res.status(200).json({'status': 'success', data: students});
      }catch(error){
        next(error);
      }
  }

  public async getStudent(req: Request , res: Response, next: NextFunction){
    try{
      const student = await this.studentService.getStudent(req.params.student_id);
      res.status(200).json({'status': 'success', data: student});
    }catch(error){
      next(error);
    }
  }

  public async updateStudent(req: Request , res: Response, next: NextFunction){
    try{
      await this.studentService.updateStudent({...req.body});
      res.status(200).json({'status': 'success', data: null});
    }catch(error){
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.studentService.resetPassword({ ...req.body });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profilePicture = await this.studentService.changeProfilePicture({
        ...req.body,
        profile_picture: req.file?.filename,
      });
      res.status(200).json({ status: "success", data: profilePicture });
    } catch (error) {
      next(error);
    }
  }

  public async deleteStudent(req: Request, res: Response, next: NextFunction){
    try{
      await this.studentService.deleteStudent(req.params.student_id);
      res.status(200).json({ status: "success", data: null });
    }catch(error){
      next(error)
    }
  }

  public async getStudentCourses(req: Request, res: Response, next: NextFunction){
    try{
      const courses = await this.studentService.getStudentCourses(req.body.user_id);
      res.status(200).json({status: "success", data: courses});
    }catch (error) {
      next(error);
    }
  }
}
export default new StudentController(new StudentService(new StudentDAO, new CoursesRegistrationsDAO()));