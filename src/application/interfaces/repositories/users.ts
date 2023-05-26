import { User } from '../../entities/user'
import { IRepository } from './base/repository'

export interface IUsersRepository extends IRepository<User> {
  findByEmailOrUsername(data: { email?: string; username?: string }): Promise<User | null>
}
