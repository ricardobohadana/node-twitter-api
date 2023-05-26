import { EditReplyUseCase } from '../../application/use-cases/edit-reply'
import { PrismaReplyRepository } from '../../data/repositories/prisma/reply'

export function makeEditReplyUseCase() {
  const replyRepository = new PrismaReplyRepository()
  return new EditReplyUseCase(replyRepository)
}
