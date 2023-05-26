import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/pt_BR'

describe('Create user e2e test', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    const payload = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
      password: faker.internet.password(),
    }
    await request(app.server).post('/user/register').send(payload).expect(201)
  })
})
