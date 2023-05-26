import { Reply } from '../entities/reply'
import { EntityNotFoundError } from '../errors/entity-not-found.error'
import { NotAllowedError } from '../errors/not-allowed.error'
import { IReplyRepository } from '../interfaces/repositories/reply'
import { UseCase } from './base/use-case'

interface EditReplyUseCaseProps {
  id: string
  content: string
  authorId: string
}

interface EditReplyUseCaseResponse {
  reply: Reply
}

export class EditReplyUseCase
  implements UseCase<EditReplyUseCaseProps, EditReplyUseCaseResponse>
{
  constructor(private readonly replyRepository: IReplyRepository) {}

  async execute({
    id,
    content,
    authorId,
  }: EditReplyUseCaseProps): Promise<EditReplyUseCaseResponse> {
    const reply = await this.replyRepository.find(id)

    if (!reply) throw new EntityNotFoundError('Reply')

    if (reply.authorId !== authorId) throw new NotAllowedError()

    reply.content = content

    await this.replyRepository.update(reply)

    return { reply }
  }
}
