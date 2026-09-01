import { INestApplication } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';
import { User } from '../src/users/entities/user.entity';

describe('API de usuários (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    configureApp(app);

    await app.init();

    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource
      .getRepository(User)
      .clear();
  });

  afterAll(async () => {
    await app.close();
  });

  // =========================================================
  // CADASTRO
  // =========================================================

  describe('POST /api/users', () => {
    it('deve cadastrar um usuário', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

      expect(response.body).not.toHaveProperty(
        'password',
      );

      expect(response.body).not.toHaveProperty(
        'passwordHash',
      );
    });

    it('deve normalizar nome e e-mail no cadastro', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: '  João Silva  ',
          email: '  JOAO@EMAIL.COM  ',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      expect(response.body.name).toBe(
        'João Silva',
      );

      expect(response.body.email).toBe(
        'joao@email.com',
      );
    });

    it('deve retornar 400 quando os dados forem inválidos', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João123',
          email: 'email-invalido',
          registration: 'ABC123',
          password: '123',
        })
        .expect(400);
    });

    it('deve retornar 400 quando um campo não permitido for enviado', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
          admin: true,
        })
        .expect(400);
    });

    it('deve retornar 409 quando o e-mail já estiver cadastrado', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Souza',
          email: 'joao@email.com',
          registration: '000002',
          password: 'xyz123',
        })
        .expect(409);
    });

    it('deve retornar 409 quando a matrícula já estiver cadastrada', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Souza',
          email: 'maria@email.com',
          registration: '000001',
          password: 'xyz123',
        })
        .expect(409);
    });
  });

  // =========================================================
  // LISTAGEM
  // =========================================================

  describe('GET /api/users', () => {
    it('deve retornar uma lista vazia', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        meta: {
          page: 1,
          limit: 15,
          totalItems: 0,
          totalPages: 0,
        },
      });
    });

    it('deve retornar usuários paginados', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Ana Silva',
          email: 'ana@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Bruno Souza',
          email: 'bruno@email.com',
          registration: '000002',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Carlos Lima',
          email: 'carlos@email.com',
          registration: '000003',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/users?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);

      expect(response.body.meta).toEqual({
        page: 1,
        limit: 2,
        totalItems: 3,
        totalPages: 2,
      });
    });

    it('deve pesquisar usuários parcialmente pelo nome', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Ana Silva',
          email: 'ana@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Bruno Souza',
          email: 'bruno@email.com',
          registration: '000002',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/users?name=Ana')
        .expect(200);

      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].name).toBe(
        'Ana Silva',
      );

      expect(response.body.meta.totalItems).toBe(1);
    });

    it('deve retornar 400 para paginação inválida', async () => {
      await request(app.getHttpServer())
        .get('/api/users?page=0&limit=15')
        .expect(400);

      await request(app.getHttpServer())
        .get('/api/users?page=1&limit=101')
        .expect(400);
    });

    it('não deve expor senha ou hash na listagem', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/users')
        .expect(200);

      expect(response.body.data).toHaveLength(1);

      expect(
        response.body.data[0],
      ).not.toHaveProperty('password');

      expect(
        response.body.data[0],
      ).not.toHaveProperty('passwordHash');
    });
  });

  // =========================================================
  // CONSULTA POR ID
  // =========================================================

  describe('GET /api/users/:id', () => {
    it('deve retornar um usuário pelo id', async () => {
      const createdUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/users/${createdUser.body.id}`,
        )
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createdUser.body.id,
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
        }),
      );

      expect(response.body).not.toHaveProperty(
        'password',
      );

      expect(response.body).not.toHaveProperty(
        'passwordHash',
      );
    });

    it('deve retornar 404 quando o usuário não existir', async () => {
      await request(app.getHttpServer())
        .get('/api/users/999999')
        .expect(404);
    });

    it('deve retornar 400 quando o id for inválido', async () => {
      await request(app.getHttpServer())
        .get('/api/users/abc')
        .expect(400);
    });
  });

  // =========================================================
  // ATUALIZAÇÃO
  // =========================================================

  describe('PATCH /api/users/:id', () => {
    it('deve atualizar parcialmente um usuário', async () => {
      const createdUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/api/users/${createdUser.body.id}`,
        )
        .send({
          name: 'João Santos',
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createdUser.body.id,
          name: 'João Santos',
          email: 'joao@email.com',
          registration: '000001',
        }),
      );

      expect(response.body).not.toHaveProperty(
        'password',
      );

      expect(response.body).not.toHaveProperty(
        'passwordHash',
      );
    });

    it('deve permitir atualizar a senha sem expor o hash', async () => {
      const createdUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/api/users/${createdUser.body.id}`,
        )
        .send({
          password: 'xyz123',
        })
        .expect(200);

      expect(response.body).not.toHaveProperty(
        'password',
      );

      expect(response.body).not.toHaveProperty(
        'passwordHash',
      );
    });

    it('deve retornar 400 quando os dados da atualização forem inválidos', async () => {
      const createdUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(
          `/api/users/${createdUser.body.id}`,
        )
        .send({
          email: 'email-invalido',
        })
        .expect(400);
    });

    it('deve retornar 409 ao atualizar para um e-mail já utilizado', async () => {
      const firstUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Souza',
          email: 'maria@email.com',
          registration: '000002',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(
          `/api/users/${firstUser.body.id}`,
        )
        .send({
          email: 'maria@email.com',
        })
        .expect(409);
    });

    it('deve retornar 409 ao atualizar para uma matrícula já utilizada', async () => {
      const firstUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Souza',
          email: 'maria@email.com',
          registration: '000002',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(
          `/api/users/${firstUser.body.id}`,
        )
        .send({
          registration: '000002',
        })
        .expect(409);
    });

    it('deve retornar 404 ao atualizar usuário inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/api/users/999999')
        .send({
          name: 'Usuário Teste',
        })
        .expect(404);
    });

    it('deve retornar 400 quando o id for inválido', async () => {
      await request(app.getHttpServer())
        .patch('/api/users/abc')
        .send({
          name: 'Usuário Teste',
        })
        .expect(400);
    });
  });

  // =========================================================
  // EXCLUSÃO
  // =========================================================

  describe('DELETE /api/users/:id', () => {
    it('deve excluir um usuário', async () => {
      const createdUser = await request(
        app.getHttpServer(),
      )
        .post('/api/users')
        .send({
          name: 'Usuário Exclusão',
          email: 'exclusao@email.com',
          registration: '000001',
          password: 'abc123',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(
          `/api/users/${createdUser.body.id}`,
        )
        .expect(204);

      await request(app.getHttpServer())
        .get(
          `/api/users/${createdUser.body.id}`,
        )
        .expect(404);
    });

    it('deve retornar 404 ao excluir usuário inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/api/users/999999')
        .expect(404);
    });

    it('deve retornar 400 quando o id for inválido', async () => {
      await request(app.getHttpServer())
        .delete('/api/users/abc')
        .expect(400);
    });
  });
});