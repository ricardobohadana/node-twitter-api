import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { User } from '@/application/entities/user'
import { Post } from '../../src/application/entities/post'

describe('Create reply e2e test', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const payload = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
    password: faker.internet.password(),
  }

  it('should be able to create a reply', async () => {
    await request(app.server).post('/user/register').send(payload).expect(201)
    const loginResponse = await request(app.server)
      .post('/user/authenticate')
      .send({ email: payload.email, password: payload.password })
      .expect(200)

    const { sessionId } = loginResponse.body as { sessionId: string; user: User }

    const createPostResponse = await request(app.server)
      .post('/post')
      .send({ content: 'this is the post content', sessionId })
      .expect(201)

    const {
      post: { id },
    } = createPostResponse.body as { post: Post }
    const content = 'this is the reply content'
    const response = await request(app.server)
      .post('/reply')
      .send({ content, sessionId, postId: id })
      .expect(201)

    expect(response.body).toBeDefined()
    expect(response.body.reply).toBeDefined()
    expect(response.body.reply.id).toBeTruthy()
    expect(response.body.reply.content).toEqual(content)
  })
})
