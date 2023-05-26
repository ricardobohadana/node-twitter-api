import { compare } from 'bcryptjs'
import { AuthenticationError } from '../errors/authentication.error'
import { IUsersRepository } from '../interfaces/repositories/users'
import { UseCase } from './base/use-case'
import { User } from '../entities/user'
import { encrypt } from '../security/encrypt'
import { addMinutes } from 'date-fns'
import { Session } from '../entities/session'

interface AuthenticateUserUseCaseProps {
  email: string
  password: string
}

interface AuthenticateUserUseCaseResponse {
  user: User
  sessionId: string
}

export class AuthenticateUserUseCase
  implements UseCase<AuthenticateUserUseCaseProps, AuthenticateUserUseCaseResponse>
{
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseProps): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmailOrUsername({ email })

    if (!user) throw new AuthenticationError()

    const doPasswordsMatch = await compare(password, user.password)
    if (!doPasswordsMatch) throw new AuthenticationError()

    const session: Session = {
      userId: user.id,
      expire: addMinutes(new Date(), 10).toISOString(),
    }

    const sessionId = encrypt(JSON.stringify(session))

    return {
      sessionId,
      user,
    }
  }
}
