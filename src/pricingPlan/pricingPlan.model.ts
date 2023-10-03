import StudentModel from "../user/student/student.model";

class PricingPlanModel {
  public id:number;
  public plan_name:string;
  public price:number;
  public students: StudentModel[];
  constructor(plan_name:string, price:number){
    this.id = 0;
    this.plan_name = plan_name;
    this.price = price;
    this.students = [];
  };
}
export default PricingPlanModel;