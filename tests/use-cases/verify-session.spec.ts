import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { IUsersRepository } from '@/application/interfaces/repositories/users'
import { MockProxy, mock } from 'vitest-mock-extended'
import { User } from '@/application/entities/user'
import { encrypt } from '@/application/security/encrypt'
import { AuthenticationError } from '@/application/errors/authentication.error'
import { Session } from '@/application/entities/session'
import { VerifySessionUseCase } from '@/application/use-cases/verify-session'
import { addMinutes, subMinutes } from 'date-fns'
import { AuthenticationExpiredError } from '@/application/errors/authentication-expired.error'

describe('Verify user authentication use-case tests', () => {
  let usersRepository: MockProxy<IUsersRepository>
  let sutUseCase: VerifySessionUseCase
  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
    password: faker.internet.password(),
  }

  const userModel = User.create(user)

  const session: Session = {
    userId: userModel.id,
    expire: addMinutes(new Date(), 10).toISOString(),
  }

  beforeEach(() => {
    usersRepository = mock<IUsersRepository>()
    sutUseCase = new VerifySessionUseCase(usersRepository)
  })

  it('should be able to verify user authentication with sessionId', async () => {
    usersRepository.find.mockImplementation(async () => userModel)

    const sessionId = encrypt(JSON.stringify(session))
    const { user } = await sutUseCase.execute({ sessionId })

    expect(user).toBeInstanceOf(User)
  })

  it('should not be able to verify user authentication with sessionId if it is expired', async () => {
    usersRepository.find.mockImplementation(async () => userModel)
    const newSession: Session = {
      userId: userModel.id,
      expire: subMinutes(new Date(), 10).toISOString(),
    }
    const sessionId = encrypt(JSON.stringify(newSession))

    expect(async () => await sutUseCase.execute({ sessionId })).rejects.toBeInstanceOf(
      AuthenticationExpiredError,
    )
  })

  it('should not be able to verify user authentication with sessionId if wrong user id is provided', async () => {
    usersRepository.find.mockImplementation(async () => null)

    const sessionId = encrypt(JSON.stringify(session))

    expect(async () => await sutUseCase.execute({ sessionId })).rejects.toBeInstanceOf(
      AuthenticationError,
    )
  })

  it('should not be able to verify user authentication if sessionId is not provided', async () => {
    usersRepository.find.mockImplementation(async () => null)

    expect(async () => await sutUseCase.execute({ sessionId: '' })).rejects.toBeInstanceOf(
      AuthenticationError,
    )
  })

  it('should not be able to verify user authentication if sessionId is in the wrong format', async () => {
    usersRepository.find.mockImplementation(async () => null)

    expect(
      async () => await sutUseCase.execute({ sessionId: 'adasdasdasdasdas' }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })
})
