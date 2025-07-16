export interface User {
  UserId:   number;
  UserName: string;
  FullName: string;
  EmailId:  string;
  Role?:    'Admin' | 'User';
}