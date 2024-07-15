import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { mockPrismaService } from 'src/__mocks__/prisma.service';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

describe('ProjectController', () => {
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

  describe('GET /api/projects', () => {
    it('should be able to get projects', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Description 1',
          employees: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              department: { id: '1', name: 'HR' },
            },
          ],
        },
      ];

      mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

      const response = await request(app.getHttpServer()).get('/api/projects');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Projects found',
        data: mockProjects,
      });
      expect(mockPrismaService.project.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no projects found', async () => {
      mockPrismaService.project.findMany.mockResolvedValue([]);

      const response = await request(app.getHttpServer()).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Projects found',
        data: [],
      });
      expect(mockPrismaService.project.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should be able to get project by id', async () => {
      const mockProject = {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        employees: [
          {
            id: '1',
            name: 'John Doe',
            email: '',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer()).get(
        '/api/projects/1',
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Project found',
        data: mockProject,
      });
      expect(mockPrismaService.project.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if project not found', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        '/api/projects/1',
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Project not found',
      });
      expect(mockPrismaService.project.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/projects', () => {
    it('should be able to create project', async () => {
      const mockProject = {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        employees: [
          {
            id: '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            name: 'John Doe',
            email: 'john@example.com',
            department: { id: '1', name: 'HR' },
          },
          {
            id: '56e68a6e-7815-4572-9c92-807539343cca',
            name: 'Jane Doe',
            email: 'jane@example.com',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      mockPrismaService.project.create.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          name: 'Project 1',
          description: 'Description 1',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Project created',
        data: mockProject,
      });
      expect(mockPrismaService.project.create).toHaveBeenCalledTimes(1);
    });

    it('should handle creating project with employees', async () => {
      const mockProjectWithEmployees = {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        employees: [
          {
            id: '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            name: 'John Doe',
            email: 'john@example.com',
            department: { id: '1', name: 'HR' },
          },
          {
            id: '56e68a6e-7815-4572-9c92-807539343cca',
            name: 'Jane Doe',
            email: 'jane@example.com',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      mockPrismaService.project.create.mockResolvedValue(
        mockProjectWithEmployees,
      );

      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          name: 'Project 1',
          description: 'Description 1',
          employees: [
            '56e68a6e-7815-4572-9c92-807539343cca',
            '56e68a6e-7815-4572-9c92-807539343cca',
          ],
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Project created',
        data: mockProjectWithEmployees,
      });
      expect(mockPrismaService.project.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          description: 'Description 1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
      expect(mockPrismaService.project.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('PUT /api/projects', () => {
    it('should be able to update project', async () => {
      const exististingProject = {
        id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
        name: 'Project 1',
        description: 'Description 1',
        employees: [
          {
            id: '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            name: 'John Doe',
            email: 'john@example.com',
            department: { id: '1', name: 'HR' },
          },
          {
            id: '56e68a6e-7815-4572-9c92-807539343cca',
            name: 'Jane Doe',
            email: 'jane@example.com',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      const mockUpdatedProject = {
        id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
        name: 'Project 2',
        description: 'Description 2',
        employees: [
          {
            id: '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            name: 'John Doe',
            email: 'john@example.com',
            department: { id: '1', name: 'HR' },
          },
          {
            id: '56e68a6e-7815-4572-9c92-807539343cca',
            name: 'Jane Doe',
            email: 'jane@example.com',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      mockPrismaService.project.findUnique.mockResolvedValue(
        exististingProject,
      );
      mockPrismaService.project.update.mockResolvedValue(mockUpdatedProject);

      const response = await request(app.getHttpServer())
        .put('/api/projects/c8f35b08-fe40-403d-ae8a-b4f443ca34c8')
        .send({
          name: 'Project 2',
          description: 'Description 1',
          employees: [
            '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            '56e68a6e-7815-4572-9c92-807539343cca',
          ],
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Project updated',
        data: mockUpdatedProject,
      });
      expect(mockPrismaService.project.update).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if project not found', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put('/api/projects/c8f35b08-fe40-403d-ae8a-b4f443ca34c8')
        .send({
          name: 'Project 2',
          description: 'Description 1',
          employees: [
            '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            '56e68a6e-7815-4572-9c92-807539343cca',
          ],
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Project not found',
      });
      expect(mockPrismaService.project.update).toHaveBeenCalledTimes(0);
    });

    it('should return 400 if validation error when updating project', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .send({
          description: 'Description 1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
      expect(mockPrismaService.project.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should be able to delete project', async () => {
      const exististingProject = {
        id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
        name: 'Project 1',
        description: 'Description 1',
        employees: [
          {
            id: '32fb1e5c-a076-478d-974e-55ffe4d58b70',
            name: 'John Doe',
            email: 'john@example.com',
            department: { id: '1', name: 'HR' },
          },
          {
            id: '56e68a6e-7815-4572-9c92-807539343cca',
            name: 'Jane Doe',
            email: 'jane@example.com',
            department: { id: '1', name: 'HR' },
          },
        ],
      };

      mockPrismaService.project.findUnique.mockResolvedValue(
        exististingProject,
      );
      mockPrismaService.project.delete.mockResolvedValue({
        id: 'c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
      });

      const response = await request(app.getHttpServer()).delete(
        '/api/projects/c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Project deleted',
      });
    });

    it('should return 404 if project not found', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).delete(
        '/api/projects/c8f35b08-fe40-403d-ae8a-b4f443ca34c8',
      );

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Project not found',
      });
    });
  });
});
