export class CreateDepartmentRequest {
  name: string;
  description?: string;
  employees?: string[];
}

export class UpdateDepartmentRequest {
  id: string;
  name?: string;
  description?: string;
  employees?: string[];
}

export class DepartmentResponse {
  id: string;
  name: string;
  description?: string;
  employees?: {
    id: string;
    name: string;
  }[];
}
