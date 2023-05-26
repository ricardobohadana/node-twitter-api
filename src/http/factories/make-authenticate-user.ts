import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user'
import { PrismaUsersRepository } from '../../data/repositories/prisma/users'

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new AuthenticateUserUseCase(usersRepository)
}
