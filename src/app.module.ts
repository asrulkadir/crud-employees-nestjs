import { CommonModule } from './common/common.module';
import { DepartmentModule } from './modules/department/department.module';
// import { DepartmentService } from './department/department.service';
// import { DepartmentController } from './department/department.controller';
import { EmployeeModule } from './modules/employee/employee.module';
// import { EmployeeService } from './employee/employee.service';
// import { EmployeeController } from './employee/employee.controller';
import { ProjectModule } from './modules/project/project.module';
// import { ProjectService } from './project/project.service';
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [CommonModule, DepartmentModule, EmployeeModule, ProjectModule],
})
export class AppModule {}
