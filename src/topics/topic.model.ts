import LessonModel from "../lessons/lesson.model"
import PricingPlanModel from "../pricingPlan/pricingPlan.model"

class TopicModel {
  public id: string
  public title: string
  public description: string
  public topic_order: number
  public points: number
  public lesson: LessonModel;
  public pricing_plan: PricingPlanModel;
  public content_url: string | null;
  public topic_type: string
  
  constructor(title: string, description: string, topic_order: number, points: number ,lesson: LessonModel, pricing_plan: PricingPlanModel,  content_url: string | null, topic_type:string ){
    this.id = 'un-known';
    this.title = title;
    this.description = description;
    this.topic_order = topic_order;
    this.points = points;
    this.lesson = lesson;
    this.pricing_plan = pricing_plan;
    this.content_url = content_url;
    this.topic_type = topic_type;
  }
}
export default TopicModel;