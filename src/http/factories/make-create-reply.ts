import { CreateReplyUseCase } from '../../application/use-cases/create-reply'
import { PrismaPostsRepository } from '../../data/repositories/prisma/posts'
import { PrismaReplyRepository } from '../../data/repositories/prisma/reply'

export function makeCreateReplyUseCase() {
  const postsRepository = new PrismaPostsRepository()
  const replyRepository = new PrismaReplyRepository()

  return new CreateReplyUseCase(replyRepository, postsRepository)
}
