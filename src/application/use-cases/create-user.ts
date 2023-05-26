import { User } from '../entities/user'
import { IUsersRepository } from '../interfaces/repositories/users'
import { UseCase } from './base/use-case'
import { UserUnderageError } from '../errors/user-underage.error'
import { differenceInYears } from 'date-fns'
import { UsernameOrEmailAlreadyInUseError } from '../errors/username-or-email-already-in-use.error'
import { hash } from 'bcryptjs'

interface CreateUserUseCaseProps {
  username: string
  email: string
  password: string
  birthDate: Date
  description?: string
}

export class CreateUserUseCase implements UseCase<CreateUserUseCaseProps, void> {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute({
    birthDate,
    email,
    password,
    username,
    description,
  }: CreateUserUseCaseProps): Promise<void> {
    const isUnique = !(await this.usersRepository.findByEmailOrUsername({
      email,
      username,
    }))

    if (!isUnique) throw new UsernameOrEmailAlreadyInUseError()
    const diffInYears = differenceInYears(new Date(), birthDate)
    if (diffInYears < 16) throw new UserUnderageError()

    const hashedPassword = await hash(password, 6)

    const user = User.create({
      email,
      password: hashedPassword,
      birthDate,
      username,
      description,
    })
    await this.usersRepository.insert(user)
  }
}
