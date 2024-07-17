import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { mockPrismaService } from 'src/__mocks__/prisma.service';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

describe('EmployeeController', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/employees', () => {
    it('should be able to get employees', async () => {
      const mockEmployees = [
        {
          id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
          email: 'beddu@email.com',
          name: 'Beddu Ramma',
          created_at: '2024-07-14T12:36:04.503Z',
          updated_at: '2024-07-14T13:49:01.898Z',
          position: 'Sales',
          salary: null,
          number_phone: null,
          address: null,
          department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
          department: {
            id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
            name: 'Other',
          },
          projects: [
            {
              id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
              name: 'Jualannya Beddu',
            },
          ],
        },
      ];

      mockPrismaService.employee.findMany.mockResolvedValue(mockEmployees);

      const response = await request(app.getHttpServer()).get('/api/employees');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employees found',
        data: mockEmployees,
      });
      expect(mockPrismaService.employee.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no employees found', async () => {
      mockPrismaService.employee.findMany.mockResolvedValue([]);

      const response = await request(app.getHttpServer()).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employees found',
        data: [],
      });
      expect(mockPrismaService.employee.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/employees/:id', () => {
    const mockEmployees = {
      id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
      email: 'beddu@email.com',
      name: 'Beddu Ramma',
      created_at: '2024-07-14T12:36:04.503Z',
      updated_at: '2024-07-14T13:49:01.898Z',
      position: 'Sales',
      salary: null,
      number_phone: null,
      address: null,
      department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      department: {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'Other',
      },
      projects: [
        {
          id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
          name: 'Jualannya Beddu',
        },
      ],
    };

    it('should be able to get employee by id', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployees);

      const response = await request(app.getHttpServer()).get(
        `/api/employees/${mockEmployees.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employee found',
        data: mockEmployees,
      });
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if employee not found', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        `/api/employees/${mockEmployees.id}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Employee not found',
      });
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('CREATE /api/employees', () => {
    const mockEmployees = {
      id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
      email: 'beddu@email.com',
      name: 'Beddu Ramma',
      created_at: '2024-07-14T12:36:04.503Z',
      updated_at: '2024-07-14T13:49:01.898Z',
      position: 'Sales',
      salary: null,
      number_phone: null,
      address: null,
      department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      department: {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'Other',
      },
      projects: [
        {
          id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
          name: 'Jualannya Beddu',
        },
      ],
    };

    const mockDepartment = {
      id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      name: 'Other',
      created_at: '2024-07-14T00:20:07.053Z',
      updated_at: '2024-07-14T09:22:02.207Z',
      description: '',
      employees: [
        {
          id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
          name: 'Asrul',
          email: 'test@email.com',
        },
      ],
    };

    it('should be able to create employee', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(null);
      mockPrismaService.department.findUnique.mockResolvedValue(mockDepartment);
      mockPrismaService.employee.create.mockResolvedValue(mockEmployees);

      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          email: 'beddu@email.com',
          name: 'Beddu Ramma',
          position: 'Sales',
          department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employee created',
        data: mockEmployees,
      });
    });

    it('should return 400 if email already exists', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(mockEmployees);

      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          email: 'beddu@email.com',
          name: 'Beddu Ramma',
          position: 'Sales',
          department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Employee email already exists',
      });
    });

    it('should return 400 if department not found', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(null);
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/api/employees')
        .send({
          email: 'beddu@email.com',
          name: 'Beddu Ramma',
          position: 'Sales',
          department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Department does not exist',
      });
    });
  });

  describe('UPDATE /api/employees/:id', () => {
    const mockEmployees = {
      id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
      email: 'beddu@email.com',
      name: 'Beddu Ramma',
      created_at: '2024-07-14T12:36:04.503Z',
      updated_at: '2024-07-14T13:49:01.898Z',
      position: 'Sales',
      salary: null,
      number_phone: null,
      address: null,
      department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      department: {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'Other',
      },
      projects: [
        {
          id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
          name: 'Jualannya Beddu',
        },
      ],
    };

    const mockUpdateEmployees = {
      id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
      email: 'beddu@email.com',
      name: 'Beddu Ramma',
      created_at: '2024-07-14T12:36:04.503Z',
      updated_at: '2024-07-14T13:49:01.898Z',
      position: 'Sales',
      salary: 10000000,
      number_phone: '08123456789',
      address: 'Jl. Raya',
      department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      department: {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'Other',
      },
      projects: [
        {
          id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
          name: 'Jualannya Beddu',
        },
      ],
    };

    it('should be able to update employee', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployees);
      mockPrismaService.employee.update.mockResolvedValue(mockUpdateEmployees);

      const response = await request(app.getHttpServer())
        .put(`/api/employees/${mockEmployees.id}`)
        .send({
          salary: 10000000,
          number_phone: '08123456789',
          address: 'Jl. Raya',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employee updated',
        data: mockUpdateEmployees,
      });
    });

    it('should return 404 if employee not found', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put(`/api/employees/${mockEmployees.id}`)
        .send({
          salary: 10000000,
          number_phone: '08123456789',
          address: 'Jl. Raya',
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Employee not found',
      });
    });
  });

  describe('DELETE /api/employees/:id', () => {
    const mockEmployees = {
      id: '65a756af-bd1d-41aa-a20f-5d31c1b5e56f',
      email: 'beddu@email.com',
      name: 'Beddu Ramma',
      created_at: '2024-07-14T12:36:04.503Z',
      updated_at: '2024-07-14T13:49:01.898Z',
      position: 'Sales',
      salary: null,
      number_phone: null,
      address: null,
      department_id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      department: {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'Other',
      },
      projects: [
        {
          id: '47c0b5f9-42c2-4a04-808d-33d0c06a923b',
          name: 'Jualannya Beddu',
        },
      ],
    };

    it('should be able to delete employee', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployees);
      mockPrismaService.employee.delete.mockResolvedValue(mockEmployees);

      const response = await request(app.getHttpServer()).delete(
        `/api/employees/${mockEmployees.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Employee deleted',
        data: mockEmployees,
      });
    });

    it('should return 404 if employee not found', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).delete(
        `/api/employees/${mockEmployees.id}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Employee not found',
      });
    });
  });
});
