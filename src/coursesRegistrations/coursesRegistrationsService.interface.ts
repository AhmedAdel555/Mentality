import AddCourseRegistrationDTO from "./dtos/add-course-registration-dto";

interface ICoursesRegistrationsServiceInterface {
  addCourseRegistration(addCourseRegistrationDTO:AddCourseRegistrationDTO): Promise<void>;
}
export default ICoursesRegistrationsServiceInterface;