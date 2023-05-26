import { EntityNotFoundError } from '../errors/entity-not-found.error'
import { NotAllowedError } from '../errors/not-allowed.error'
import { IReplyRepository } from '../interfaces/repositories/reply'
import { UseCase } from './base/use-case'

interface DeleteReplyUseCaseProps {
  id: string
  authorId: string
}

export class DeleteReplyUseCase implements UseCase<DeleteReplyUseCaseProps, void> {
  constructor(private readonly replyRepository: IReplyRepository) {}

  async execute({ id, authorId }: DeleteReplyUseCaseProps): Promise<void> {
    const reply = await this.replyRepository.find(id)

    if (!reply) throw new EntityNotFoundError('Reply')

    if (reply.authorId !== authorId) throw new NotAllowedError()

    await this.replyRepository.delete(reply)
  }
}
