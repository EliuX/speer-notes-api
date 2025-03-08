import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let noteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'TestPassword123' })
      .expect(201);
  });

  it('should log in an existing user and receive an access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'TestPassword123' })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    authToken = response.body.accessToken;
  });

  it('should create a new note', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Test Note', content: 'This is a test note.' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    noteId = response.body.id;
  });

  it('should get all notes for the authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a note by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(response.body).toHaveProperty('title', 'Test Note');
  });

  it('should update a note by ID', async () => {
    const response = await request(app.getHttpServer())
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Note', content: 'Updated content.' })
      .expect(200);

    expect(response.body).toHaveProperty('title', 'Updated Note');
  });

  it('should delete a note by ID', async () => {
    await request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should share a note with another user', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/notes/${noteId}/share`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ sharedWith: 'anotheruser' })
      .expect(201);

    expect(response.body).toHaveProperty('sharedWith', 'anotheruser');
  });

  it('should search for notes based on keywords', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/search?q=test')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
