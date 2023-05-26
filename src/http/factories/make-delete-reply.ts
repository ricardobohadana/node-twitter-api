import { DeleteReplyUseCase } from '../../application/use-cases/delete-reply'
import { PrismaReplyRepository } from '../../data/repositories/prisma/reply'

export function makeDeleteReplyUseCase() {
  const postsRepository = new PrismaReplyRepository()
  return new DeleteReplyUseCase(postsRepository)
}
