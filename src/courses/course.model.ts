import InstructorModel from "../user/instructor/instructor.model"
import Levels from "./levels.enum"
class CourseModel {
  public id : string
  public title : string
  public description : string
  public requirements : string
  public level: Levels
  public picture : string
  public instructor: InstructorModel;
  constructor(title:string, description: string, requirements:string, level:Levels ,picture:string, instructor: InstructorModel){
    this.id = 'un-known';
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.level = level;
    this.picture = picture;
    this.instructor = instructor;
  };
}

export default CourseModel;