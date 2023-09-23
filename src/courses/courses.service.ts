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

    public async createCourse(title:string, description:string, userId:string, userRole:string, level:string){
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
}
export default CoursesService;