class PricingPlanModel {
  public id:number;
  public plan_name:string;
  public attributes:string
  public price:number;
  constructor(plan_name:string, price:number, attributes:string){
    this.id = 0;
    this.plan_name = plan_name;
    this.attributes = attributes;
    this.price = price;
  };
}
export default PricingPlanModel;