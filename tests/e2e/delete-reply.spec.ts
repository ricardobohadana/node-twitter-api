import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { User } from '@/application/entities/user'
import { Post } from '../../src/application/entities/post'
import { Reply } from '../../src/application/entities/reply'

describe('Delete reply e2e test', () => {
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

  it('should be able to delete a reply', async () => {
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
      post: { id: postId },
    } = createPostResponse.body as { post: Post }
    const content = 'this is the reply content'
    const createReplyResponse = await request(app.server)
      .post('/reply')
      .send({ content, sessionId, postId })
      .expect(201)

    const {
      reply: { id },
    } = createReplyResponse.body as { reply: Reply }

    await request(app.server).delete(`/reply/${id}`).send({ sessionId }).expect(200)
  })
})
