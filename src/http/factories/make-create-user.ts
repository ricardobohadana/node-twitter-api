import { CreateUserUseCase } from '../../application/use-cases/create-user'
import { PrismaUsersRepository } from '../../data/repositories/prisma/users'

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new CreateUserUseCase(usersRepository)
}
