import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { IUsersRepository } from '@/application/interfaces/repositories/users'
import { MockProxy, mock } from 'vitest-mock-extended'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { User } from '@/application/entities/user'
import { decrypt } from '@/application/security/encrypt'
import { AuthenticationError } from '@/application/errors/authentication.error'
import { Session } from '@/application/entities/session'
import { hashSync } from 'bcryptjs'

describe('Authenticate user use-case tests', () => {
  let usersRepository: MockProxy<IUsersRepository>
  let sutUseCase: AuthenticateUserUseCase
  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
    password: faker.internet.password(),
  }

  beforeEach(() => {
    usersRepository = mock<IUsersRepository>()
    sutUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate a user', async () => {
    const { birthDate, email, password, username } = user
    usersRepository.findByEmailOrUsername.mockImplementation(async () =>
      User.create({
        birthDate,
        email,
        username,
        password: hashSync(password, 6),
      }),
    )

    const response = await sutUseCase.execute({ email: user.email, password: user.password })

    expect(response).toBeDefined()
    expect(response.sessionId).toBeDefined()
    expect(response.user).toBeDefined()
    const session: Session = JSON.parse(decrypt(response.sessionId))
    expect(session.userId).toEqual(response.user.id)
    expect(new Date(session.expire).getTime()).toBeGreaterThan(new Date().getTime())
  })

  it('should not be able to authenticate an unexisting user', async () => {
    usersRepository.findByEmailOrUsername.mockImplementation(async () => null)

    expect(
      async () => await sutUseCase.execute({ email: user.email, password: user.password }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('should not be able to authenticate user with wrong password', async () => {
    usersRepository.findByEmailOrUsername.mockImplementation(async () => User.create(user))

    expect(
      async () => await sutUseCase.execute({ email: user.email, password: user.email }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })
})
