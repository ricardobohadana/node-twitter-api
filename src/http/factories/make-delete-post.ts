import { DeletePostUseCase } from '../../application/use-cases/delete-post'
import { PrismaPostsRepository } from '../../data/repositories/prisma/posts'

export function makeDeletePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  return new DeletePostUseCase(postsRepository)
}
