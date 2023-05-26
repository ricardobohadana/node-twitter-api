import { UseCase } from './base/use-case'
import { IUsersRepository } from '../interfaces/repositories/users'
import { decrypt } from '../security/encrypt'
import { compareDesc } from 'date-fns'
import { Session } from '../entities/session'
import { AuthenticationExpiredError } from '../errors/authentication-expired.error'
import { AuthenticationError } from '../errors/authentication.error'
import { User } from '../entities/user'

interface VerifySessionUseCaseProps {
  sessionId: string
}

interface VerifySessionUseCaseResponse {
  user: User
}

export class VerifySessionUseCase
  implements UseCase<VerifySessionUseCaseProps, VerifySessionUseCaseResponse>
{
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    sessionId,
  }: VerifySessionUseCaseProps): Promise<VerifySessionUseCaseResponse> {
    try {
      const sessionString = decrypt(sessionId)
      const session = JSON.parse(sessionString) as Session
      if (compareDesc(new Date(), new Date(session.expire)) < 0)
        throw new AuthenticationExpiredError()

      const user = await this.usersRepository.find(session.userId)

      if (!user) throw new AuthenticationError()

      return { user }
    } catch (error) {
      if (error instanceof AuthenticationExpiredError) throw new AuthenticationExpiredError()
      throw new AuthenticationError()
    }
  }
}
