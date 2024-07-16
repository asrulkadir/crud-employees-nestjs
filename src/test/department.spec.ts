import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { mockPrismaService } from 'src/__mocks__/prisma.service';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

describe('DepartmentController', () => {
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

  describe('GET /api/department', () => {
    it('should be able to get departments', async () => {
      const mockDepartment = [
        {
          id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
          name: 'IT',
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
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer()).get(
        '/api/departments',
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Departments retrieved',
        data: mockDepartment,
      });
      expect(mockPrismaService.department.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no department found', async () => {
      mockPrismaService.department.findMany.mockResolvedValue([]);

      const response = await request(app.getHttpServer()).get(
        '/api/departments',
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Departments retrieved',
        data: [],
      });
      expect(mockPrismaService.department.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/departments/:id', () => {
    it('should be able to get department by id', async () => {
      const mockDepartment = {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'IT',
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

      mockPrismaService.department.findUnique.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer()).get(
        '/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8',
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Department retrieved',
        data: mockDepartment,
      });
      expect(mockPrismaService.department.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if department not found', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        '/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8',
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Department not found',
      });
      expect(mockPrismaService.department.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/departments', () => {
    const mockDepartment = {
      id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
      name: 'IT',
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
    it('should be able to create department', async () => {
      mockPrismaService.department.create.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer())
        .post('/api/departments')
        .send({
          name: 'IT',
          employees: ['c8f35b08-fe40-403d-ae8a-b4f443ca34c8'],
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Department created',
        data: mockDepartment,
      });
      expect(mockPrismaService.department.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if department already exists', async () => {
      mockPrismaService.department.findFirst.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer())
        .post('/api/departments')
        .send({
          name: 'IT',
          employees: ['c8f35b08-fe40-403d-ae8a-b4f443ca34c8'],
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Department name already exists',
      });
      expect(mockPrismaService.department.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /api/departments/:id', () => {
    it('should be able to update department', async () => {
      const mockDepartment = {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'IT',
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

      mockPrismaService.department.findUnique.mockResolvedValue(mockDepartment);
      mockPrismaService.department.findFirst.mockResolvedValue(null);
      mockPrismaService.department.update.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer())
        .put('/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8')
        .send({
          name: 'Other',
          employees: ['c8f35b08-fe40-403d-ae8a-b4f443ca34c8'],
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Department updated',
        data: mockDepartment,
      });
      expect(mockPrismaService.department.update).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if department not found', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put('/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8')
        .send({
          name: 'IT',
          employees: ['c8f35b08-fe40-403d-ae8a-b4f443ca34c8'],
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Department not found',
      });
      expect(mockPrismaService.department.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if department name already exists', async () => {
      const mockDepartment = {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'IT',
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
      mockPrismaService.department.findUnique.mockResolvedValue(mockDepartment);
      mockPrismaService.department.findFirst.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer())
        .put('/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8')
        .send({
          name: 'IT',
          employees: ['c8f35b08-fe40-403d-ae8a-b4f443ca34c8'],
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Department name already exists',
      });
      expect(mockPrismaService.department.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /api/departments/:id', () => {
    it('should be able to delete department', async () => {
      const mockDepartment = {
        id: '78aa92ce-194a-4211-af75-0423f9be6dd8',
        name: 'IT',
        created_at: '2024-07-14T00:20:07.053Z',
        updated_at: '2024-07-14T09:22:02.207Z',
        description: '',
        employees: [
          {
            id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
            name: 'Asrul',
            email: 'asrul@email.com',
          },
        ],
      };

      mockPrismaService.department.findUnique.mockResolvedValue(mockDepartment);
      mockPrismaService.department.delete.mockResolvedValue(mockDepartment);

      const response = await request(app.getHttpServer()).delete(
        '/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8',
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Department deleted',
        data: mockDepartment,
      });
      expect(mockPrismaService.department.delete).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if department not found', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).delete(
        '/api/departments/78aa92ce-194a-4211-af75-0423f9be6dd8',
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Department not found',
      });
      expect(mockPrismaService.department.delete).toHaveBeenCalledTimes(0);
    });
  });
});
