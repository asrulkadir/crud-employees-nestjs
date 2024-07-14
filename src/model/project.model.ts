export class CreateProjectRequest {
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  employees?: string[];
}

export class UpdateProjectRequest {
  id: string;
  name?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  employees?: string[];
}

export class ProjectResponse {
  id: string;
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  employees?: {
    id: string;
    name: string;
  }[];
}
