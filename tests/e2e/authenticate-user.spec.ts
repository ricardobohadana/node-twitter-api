import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/pt_BR'

describe('Authenticate user e2e test', () => {
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

  it('should be able to authenticate a user', async () => {
    await request(app.server).post('/user/register').send(payload).expect(201)
    const response = await request(app.server)
      .post('/user/authenticate')
      .send({ email: payload.email, password: payload.password })
      .expect(200)

    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('sessionId')
    expect(response.body.user).toBeTruthy()
    expect(response.body.sessionId).toBeTruthy()
  })
})
