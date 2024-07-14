export class CreateEmployeeRequest {
  email: string;
  name: string;
  position: string;
  salary?: number;
  number_phone?: string;
  address?: string;
  department_id: string;
}

export class UpdateEmployeeRequest {
  id: string;
  email?: string;
  name?: string;
  position?: string;
  salary?: number;
  number_phone?: string;
  address?: string;
  department_id?: string;
}

export class EmployeeResponse {
  id: string;
  email: string;
  name: string;
  position: string;
  salary?: number;
  number_phone?: string;
  address?: string;
  department: {
    id: string;
    name: string;
  };
  projects?: {
    id: string;
    name: string;
  }[];
}
