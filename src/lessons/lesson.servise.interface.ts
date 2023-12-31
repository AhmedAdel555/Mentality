import AddLessonRequestDTO from "./dtos/add-lesson-request-dto";
import DeleteLessonRequestDTO from "./dtos/delete-lesson-request-dto";
import LessonResponsDTO from "./dtos/lesson-respons-dto";
import UpdateLessonRequestDTO from "./dtos/update-lesson-request-dto";

interface ILessonService{
    addLesson(addLessonRequestDTO:AddLessonRequestDTO): Promise<void>;
    getCourseLessons(courseId: string): Promise<LessonResponsDTO[]>;
    getLesson(id:string): Promise<LessonResponsDTO>;
    updateLesson(updateLessonRequestDTO: UpdateLessonRequestDTO): Promise<void>;
    deleteLesson(deleteLessonRequestDTO:DeleteLessonRequestDTO): Promise<void>;
}
export default ILessonService;