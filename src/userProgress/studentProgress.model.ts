import TopicModel from "../topics/topic.model";
import StudentModel from "../user/student/student.model";
import StatusProgress from "./statusProgress.enum";

class StudentProgressModel {
  public student: StudentModel
  public topic: TopicModel
  public status: StatusProgress

  constructor(student: StudentModel, topic: TopicModel, status: StatusProgress) {
    this.student = student;
    this.topic = topic;
    this.status = status;
  }
}
export default StudentProgressModel;