import { User } from '../../../application/entities/user'
import { User as UserModel } from '@prisma/client'
import { RepositoryFilterProps } from '../../../application/interfaces/repositories/base/repository'
import { IUsersRepository } from '../../../application/interfaces/repositories/users'
import { prisma } from '../../prisma/client'

export class PrismaUsersRepository implements IUsersRepository {
  private fromDatabaseToEntity({ updatedAt, description, id, ...rest }: UserModel): User {
    return User.create(
      {
        ...rest,
        description: description ?? undefined,
      },
      { id, updatedAt: updatedAt ?? undefined },
    )
  }

  delete(entity: User): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByEmailOrUsername({
    email,
    username,
  }: {
    email?: string | undefined
    username?: string | undefined
  }): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        OR: {
          email,
          username,
        },
      },
    })
    if (user) return this.fromDatabaseToEntity(user)
    return null
  }

  async insert(entity: User): Promise<void> {
    const { id, email, password, birthDate, description, updatedAt, username } = entity

    await prisma.user.create({
      data: { id, email, password, birthDate, description, updatedAt, username },
    })
  }

  async find(id: string): Promise<User | null> {
    const userModel = await prisma.user.findUnique({ where: { id } })
    if (!userModel) return null
    return this.fromDatabaseToEntity(userModel)
  }

  findMany(data: RepositoryFilterProps): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  update(entity: User): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
