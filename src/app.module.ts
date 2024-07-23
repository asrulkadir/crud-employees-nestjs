import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { DepartmentModule } from './modules/department/department.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProjectModule } from './modules/project/project.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    CommonModule,
    DepartmentModule,
    EmployeeModule,
    ProjectModule,
  ],
})
export class AppModule {}
