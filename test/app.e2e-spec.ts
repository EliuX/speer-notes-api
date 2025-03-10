import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { Note } from 'src/note/entities/note.entity';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let validCredentials: CreateUserDto;
  let validUser: AuthUserDto;
  let authToken: string;

  const createUser = async () => {
    if (!validCredentials) {
      validCredentials = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'TestPassword123',
      } as CreateUserDto;

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(validCredentials)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', validCredentials.email);
      validUser = new AuthUserDto(response.body);
    }

    return validCredentials;
  };

  const loginUser = async () => {
    const userCredentials = await createUser();
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
    authToken = response.body.access_token;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('Auth', () => {
    it('should sign up a new user', async () => {
      await createUser();
    });

    it('should return a 400 if sign up is missing the email', async () => {
      const badPayload = {
        name: faker.person.fullName(),
        password: 'TestPassword123',
      } as CreateUserDto;

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(badPayload)
        .expect(400);
    });

    it('should login an existing user and receive an access token', async () => {
      await loginUser();
    });
  });

  describe('Notes', () => {
    let newNote: Note;

    beforeAll(async () => {
      await loginUser();
    });

    const createNote = async () => {
      if (!newNote) {
        const newNotePayload = {
          title: 'Test Note',
          content: 'This is a test note.',
        } as CreateNoteDto;

        const response = await request(app.getHttpServer())
          .post('/notes')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newNotePayload)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('ownerId', validUser.id);
        newNote = response.body;
      }

      return newNote;
    };

    it('should create a new note', async () => {
      await createNote();
    });

    it('should get all notes for the authenticated user', async () => {
      await createNote();

      const response = await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length > 0).toBe(true);
    });

    it('should get a note by ID', async () => {
      const lastNote = await createNote();

      const response = await request(app.getHttpServer())
        .get(`/notes/${lastNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('title', lastNote.title);
      expect(response.body).toHaveProperty('content', lastNote.content);
    });

    it('should update a note by ID', async () => {
      const response = await request(app.getHttpServer())
        .put(`/notes/${newNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Note', content: 'Updated content.' })
        .expect(200);

      expect(response.body).toHaveProperty('id', newNote.id);
      expect(response.body).toHaveProperty('title', 'Updated Note');
      expect(response.body).toHaveProperty('content', 'Updated content.');
    });

    it('should delete a note by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/notes/${newNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should share a note with another user', async () => {
      const noteToShare = await createNote();
      const anotherUserId = '67ce2450768e6dc3e6013b9e';

      const response = await request(app.getHttpServer())
        .post(`/notes/${noteToShare.id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sharedWith: anotherUserId })
        .expect(201);

      expect(response.body).toHaveProperty('sharedWith', [anotherUserId]);
    });

    it('should search for notes based on keywords', async () => {
      const response = await request(app.getHttpServer())
        .get('/search?q=test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
