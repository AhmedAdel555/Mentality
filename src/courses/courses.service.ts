import CoursesDAO from "./courses.dao";
import course from "./courses.model";
import levels from "./levels.enum";
class CoursesService{

    constructor(private readonly coursesDAO: CoursesDAO){};

    private getlevel(level:string): levels|undefined{
      if(level === "Beginner") return levels.Beginner;
      if(level === "intermediate") return levels.intermediate;
      if(level === "expert") return levels.expert
    }

    public async createCourse(title:string, description:string, 
                              userId:string, userRole:string, 
                              level:string): Promise<course>{
        try{
          if(userRole !== "instructor"){
            throw new Error("you can not add course");
          }
          const levelId:levels|undefined = this.getlevel(level);
          if(levelId === undefined){
            throw new Error("level is not exist");
          }
          const newCourse:course = {title:title, description:description, instructorId:userId, levelId:levelId};
          return this.coursesDAO.createCourse(newCourse);
        }catch(err){
          throw new Error((err as Error).message);
        }
    }

    public async getAllCourses(): Promise<course[]>{
      try{
        return this.coursesDAO.getAllCourses();
      }catch(err){
        throw new Error((err as Error).message);
      }
    }

    public async getCourse(id: string): Promise<course>{
      try{
        const course:course = await this.coursesDAO.getCourse(id);
        if(!course) throw new Error(`faild to get course check id: ${id}`);
        return course;
      }catch(err){
        throw new Error((err as Error).message);
      }
    }

    public async updateCourse(courseId: string, title:string, 
                              description:string, userId:string, 
                              userRole:string, level:string): Promise<course>{
      try{
        if(userRole === "manager" || userRole === "instructor"){
          if(userRole === "instructor"){
            const instructorId = (await this.getCourse(courseId)).instructorId;
            if(userId !== instructorId){
              throw new Error("this is not your course you can not update course");
            }
          }
        }else{
          throw new Error("you can not update course");
        }
        const levelId:levels|undefined = this.getlevel(level);
          if(levelId === undefined){
            throw new Error("level is not exist");
          }
        const course:course = {id: courseId,title:title, description:description, instructorId:userId, levelId:levelId};
        const updatedCourse = await this.coursesDAO.updateCourse(course);
        if(!updatedCourse) throw new Error(`faild to update course check id: ${course.id}`)
        return updatedCourse;
      }catch(err){
        throw new Error((err as Error).message);
      }
    }

    public async deleteCourse(id: string, userId:string, userRole:string): Promise<null>{
      try{
        if(userRole === "manager" || userRole === "instructor"){
          if(userRole === "instructor"){
            const instructorId = (await this.getCourse(id)).instructorId;
            if(userId !== instructorId){
              throw new Error("this is not your course you can not delete course");
            }
          }
        }else{
          throw new Error("you can not delete course");
        }
        const deletedCourse = await this.coursesDAO.deleteCourse(id);
        if(!deletedCourse) throw new Error(`faild to delete course check id: ${id}`)
        return null;
      }catch(err){
        throw new Error((err as Error).message);
      }
    }
}
export default CoursesService;