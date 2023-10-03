import CourseRegistrationModel from "../courseRegistration/courseRegistration.model"
import CourseRegistration from "../courseRegistration/courseRegistration.model"
import RatesModel from "../rates/rates.model"
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
  public coursesRegistration: CourseRegistrationModel[];
  public rates: RatesModel[];
  constructor(title:string, description: string, requirements:string, level:Levels ,picture:string, instructor: InstructorModel){
    this.id = 'un-known';
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.level = level;
    this.picture = picture;
    this.instructor = instructor;
    this.coursesRegistration = [];
    this.rates = [];
  };
}

export default CourseModel;