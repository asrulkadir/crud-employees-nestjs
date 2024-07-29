import { EUserRole } from 'src/enum/user.enum';

export class CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: EUserRole.Admin | EUserRole.User;
}

export class UserResponse {
  id?: string;
  username: string;
  name: string;
  email: string;
  access_token?: string;
  role: string;
}

export class UpdateUserRequest {
  id: string;
  name?: string;
  password?: string;
  username?: string;
  email?: string;
  role?: EUserRole.Admin | EUserRole.User;
}
