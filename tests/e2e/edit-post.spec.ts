import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { User } from '@/application/entities/user'
import { Post } from '../../src/application/entities/post'

describe('Edit post e2e test', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  const userPayload = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
    password: faker.internet.password(),
  }

  it('should be able to update a post', async () => {
    await request(app.server).post('/user/register').send(userPayload).expect(201)
    const loginResponse = await request(app.server)
      .post('/user/authenticate')
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200)

    const { sessionId } = loginResponse.body as { sessionId: string; user: User }

    const createPostResponse = await request(app.server)
      .post('/post')
      .send({ content: 'this is the post content', sessionId })
      .expect(201)

    const { post } = createPostResponse.body as { post: Post }
    const response = await request(app.server)
      .put(`/post/${post.id}`)
      .send({ content: 'this is the new post content', sessionId })
      .expect(202)

    expect(response.body).toBeDefined()
    expect(response.body.post).toBeDefined()

    const { post: newPost } = response.body as { post: Post }

    expect(newPost.content).not.toEqual(post.content)
    expect(newPost.updatedAt).not.toEqual(post.updatedAt)
  })
})
