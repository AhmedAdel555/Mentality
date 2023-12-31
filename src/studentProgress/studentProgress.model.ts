import TopicModel from "../topics/topic.model";
import StudentModel from "../user/student/student.model";
import StatusProgress from "./statusProgress.enum";

class StudentProgressModel {
  public student: StudentModel
  public topic: TopicModel
  public status: StatusProgress
  public grade: number
  public solution: string | null

  constructor(student: StudentModel, topic: TopicModel) {
    this.student = student;
    this.topic = topic;
    this.status = StatusProgress.NOTFINISHED;
    this.grade = 0;
    this.solution = null;
  }
}
export default StudentProgressModel;