class UserModel {
  public id: string
  public user_name:string
  public email:string
  public password: string
  public profile_picture:string
  public phone_number:string | null = null
  public address:string | null = null
  public reset_password_token: string| null = null

  constructor(user_name: string, email: string, password: string, profile_picture:string){
    this.id = 'un-known';
    this.user_name = user_name;
    this.email = email;
    this.password = password;
    this.profile_picture = profile_picture;
  }
}
export default UserModel;