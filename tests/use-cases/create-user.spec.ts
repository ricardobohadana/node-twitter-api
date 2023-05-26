import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { IUsersRepository } from '@/application/interfaces/repositories/users'
import { MockProxy, mock } from 'vitest-mock-extended'
import { UserUnderageError } from '@/application/errors/user-underage.error'
import { User } from '@/application/entities/user'
import { UsernameOrEmailAlreadyInUseError } from '@/application/errors/username-or-email-already-in-use.error'

describe('Create user use-case tests', () => {
  let usersRepository: MockProxy<IUsersRepository>
  let sutUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepository = mock<IUsersRepository>()
    sutUseCase = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create a user', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
      password: faker.internet.password(),
    }

    await sutUseCase.execute(user)

    expect(usersRepository.insert).toHaveBeenCalledOnce()
  })

  it("should hash user's password to create a user", async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
      password: faker.internet.password(),
    }
    let password = user.password
    usersRepository.insert.mockImplementationOnce(async (user) => {
      password = user.password
    })
    await sutUseCase.execute(user)

    expect(usersRepository.insert).toHaveBeenCalledOnce()
    expect(user.password).not.toEqual(password)
  })

  it('should not be able to create user with an existing email or username', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
      password: faker.internet.password(),
    }

    usersRepository.findByEmailOrUsername.mockImplementation(async () => User.create(user))

    await expect(async () => await sutUseCase.execute(user)).rejects.toBeInstanceOf(
      UsernameOrEmailAlreadyInUseError,
    )

    expect(usersRepository.insert).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create users under 16yo', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 10, max: 15, mode: 'age' }),
      password: faker.internet.password(),
    }

    await expect(async () => await sutUseCase.execute(user)).rejects.toBeInstanceOf(
      UserUnderageError,
    )

    expect(usersRepository.insert).not.toHaveBeenCalledOnce()
  })
})
