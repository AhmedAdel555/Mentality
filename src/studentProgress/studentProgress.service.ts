import CoursesDAO from "../courses/courses.dao";
import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";
import SubscriptionDAO from "../subscription/subscription.dao";
import Topics from "../topics/topics.enum";
import StudentDAO from "../user/student/student.dao";
import AppError from "../utils/appError";
import FinishTopicRequestDTO from "./dtos/finish-topic-requst-dto";
import GetAllCourseTasksSubmissionsDTO from "./dtos/get-all-course-tasks-dto";
import GetStudentLessonProgressDTO from "./dtos/get-student-lesson-progress-dto";
import GradeTaskRequestDTO from "./dtos/grade-task-request-dto";
import PendingTasksResponseDTO from "./dtos/pending-tasks-response-dto";
import TopicsProgressResponseDTO from "./dtos/topics-progress-response-dto";
import StatusProgress from "./statusProgress.enum";
import StudentProgressDAO from "./studentProgress.dao";
import StudentProgressModel from "./studentProgress.model";
import IstudentProgressServiceInterface from "./studentProgressService.interface";

class StudentProgressService implements IstudentProgressServiceInterface {
  constructor(
    private readonly studentProgressDAO: StudentProgressDAO,
    private readonly courseRegistrationDAO: CoursesRegistrationsDAO,
    private readonly subscriptionDAO: SubscriptionDAO,
    private readonly studentDAO: StudentDAO,
    private readonly courseDAO: CoursesDAO
  ) {}

  public async getStudentLessonProgress(
    getStudentLessonProgressDTO: GetStudentLessonProgressDTO
  ): Promise<TopicsProgressResponseDTO[]> {
    try {
      const studentCourses =
        await this.courseRegistrationDAO.getCourseRegistrationsForStudent(
          getStudentLessonProgressDTO.user_id
        );
      let registered: boolean = false;
      for (let i = 0; i < studentCourses.length; i++) {
        if (
          studentCourses[i].course.id === getStudentLessonProgressDTO.course_id
        ) {
          registered = true;
        }
      }
      if (!registered)
        throw new AppError("you have to enroll in the course first", 403);

      const topicsProgress =
        await this.studentProgressDAO.getAllStudentLessonProgress(
          getStudentLessonProgressDTO.user_id,
          getStudentLessonProgressDTO.lesson_id
        );

      const topicsProgressResponse: TopicsProgressResponseDTO[] =
        topicsProgress.map((topicProgress, index) => {
          return {
            id: topicProgress.topic.id,
            title: topicProgress.topic.title,
            topic_order: topicProgress.topic.topic_order,
            points: topicProgress.topic.points,
            pricing_plan: topicProgress.topic.pricing_plan,
            topic_type: topicProgress.topic.topic_type,
            status: topicProgress.status,
            grade: topicProgress.grade,
            solution: topicProgress.solution,
          };
        });

      return topicsProgressResponse;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async finishTopic(
    finishTopicRequestDTO: FinishTopicRequestDTO
  ): Promise<void> {
    try {
      const topicProgress = await this.studentProgressDAO.getStudentProgress(
        finishTopicRequestDTO.user_id,
        finishTopicRequestDTO.topic_id
      );
      if (!topicProgress)
        throw new AppError(
          "you have to enroll to the course of this topic",
          403
        );
      
      if(topicProgress.status === StatusProgress.FINISHED){
        return;
      }
      
      const currentStudentPlan = (
        await this.subscriptionDAO.getStudentSubscriptions(
          finishTopicRequestDTO.user_id
        )
      )[0].pricing_plan;

      if (topicProgress.topic.pricing_plan.price > currentStudentPlan.price) {
        throw new AppError("upgrade to finish this topic", 403);
      }

      if (topicProgress.topic.topic_type === Topics.TASK) {
        if (!finishTopicRequestDTO.task_solution) {
          throw new AppError("solution is empty", 400);
        }
        topicProgress.status = StatusProgress.PENDING;
        topicProgress.solution = finishTopicRequestDTO.task_solution;
      } else if (topicProgress.topic.topic_type === Topics.TUTORIAL) {
        topicProgress.status = StatusProgress.FINISHED;
        topicProgress.grade = topicProgress.topic.points;
      }
      // update user progress
      await this.studentProgressDAO.updateStudentProgress(topicProgress);
      if(topicProgress.topic.topic_type === Topics.TUTORIAL){
        await this.changeCourseProgress(finishTopicRequestDTO.user_id, topicProgress);
        await this.changeStudentPoints(finishTopicRequestDTO.user_id);
      }

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAllCourseTasksSubmissions(
    getAllCourseTasksSubmissionsDTO: GetAllCourseTasksSubmissionsDTO
  ): Promise<PendingTasksResponseDTO[]> {
    try {
      const course = await this.courseDAO.getCourseById(getAllCourseTasksSubmissionsDTO.course_id);
      if(!course) throw new AppError("course not found", 404);
      
      if(course.instructor.id !== getAllCourseTasksSubmissionsDTO.user_id){
        throw new AppError("you don't have permission", 403);
      }

      const pendingTasks = await this.studentProgressDAO.getAllPendingTasksCourseProgress(getAllCourseTasksSubmissionsDTO.course_id);
      
      const pendingTasksResponse:PendingTasksResponseDTO[]  = pendingTasks.map((pendingTask, index) => {
        return {
          student: {
            id: pendingTask.student.id,
            user_name: pendingTask.student.user_name,
            email:pendingTask.student.email,
            profile_picture:pendingTask.student.profile_picture,
            phone_number: pendingTask.student.phone_number,
            address: pendingTask.student.address,
            points: pendingTask.student.points
          },
          topic: {
            id: pendingTask.topic.id,
            title: pendingTask.topic.title,
            topic_order: pendingTask.topic.topic_order,
            points: pendingTask.topic.points,
            pricing_plan: pendingTask.topic.pricing_plan,
            topic_type: pendingTask.topic.topic_type,
            description: pendingTask.topic.description,
            content_url: pendingTask.topic.content_url,
            lesson : {
              id: pendingTask.topic.lesson.id,
              title:pendingTask.topic.lesson.title,
              lesson_order: pendingTask.topic.lesson.lesson_order
            }
          },
          solution: pendingTask.solution
        }
      })

      return pendingTasksResponse;

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async gradeTask(gradeTaskRequestDTO:GradeTaskRequestDTO): Promise<void> {
    try {
      const topicProgress = await this.studentProgressDAO.getStudentProgress(gradeTaskRequestDTO.student_id, gradeTaskRequestDTO.topic_id);
      if(!topicProgress) throw new AppError("task not found", 404);
      if(topicProgress.topic.lesson.course.instructor.id !== gradeTaskRequestDTO.user_id){
        throw new AppError("you don't have permission", 403);
      }
      if(gradeTaskRequestDTO.grade > topicProgress.topic.points){
        throw new AppError("grade must be lesst or equal than points of task", 400);
      }
      topicProgress.grade = gradeTaskRequestDTO.grade;
      topicProgress.status = StatusProgress.FINISHED;
      await this.studentProgressDAO.updateStudentProgress(topicProgress);
      await this.changeCourseProgress(gradeTaskRequestDTO.student_id, topicProgress);
      await this.changeStudentPoints(gradeTaskRequestDTO.student_id);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  private async changeCourseProgress(studentId: string ,topicProgress: StudentProgressModel): Promise<void>{
    try{
      const studentCourseProgress =
      await this.studentProgressDAO.getAllStudentCourseProgress(
        studentId,
        topicProgress.topic.lesson.course.id
      );
    const newProgress =
      studentCourseProgress.filter((progress, index) => {
        return progress.status === StatusProgress.FINISHED;
      }).length / studentCourseProgress.length;
  
    const studentCourses =
      await this.courseRegistrationDAO.getCourseRegistrationsForStudent(
        studentId
      );
    for (let i = 0; i < studentCourses.length; i++) {
      if (
        studentCourses[i].course.id === topicProgress.topic.lesson.course.id
      ) {
        studentCourses[i].course_progress = Math.round(newProgress * 100);
        await this.courseRegistrationDAO.updateCourseRegistration(
          studentCourses[i]
        );
        break;
      }
    }
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  private async changeStudentPoints(studentId: string){
    try{
      const student = await this.studentDAO.getStudentById(studentId);
      if(!student) throw new AppError("Student not found", 404);
      const points = await this.studentProgressDAO.getSumOfStudentGrades(studentId);
      student.points = points;
      await this.studentDAO.updateStudent(student);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default StudentProgressService;
