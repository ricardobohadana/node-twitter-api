import { VerifySessionUseCase } from '../../application/use-cases/verify-session'
import { PrismaUsersRepository } from '../../data/repositories/prisma/users'

export function makeVerifySessionUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new VerifySessionUseCase(usersRepository)
}
