import { EUserRole } from 'src/enum/user.enum';

export class CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: EUserRole.Admin | EUserRole.User;
}

export class UserResponse {
  username: string;
  name: string;
  email: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
