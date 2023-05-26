import { FetchPostsUseCase } from '../../application/use-cases/fetch-posts'
import { PrismaPostsRepository } from '../../data/repositories/prisma/posts'

export function makeFetchPostsUseCase() {
  const postsRepository = new PrismaPostsRepository()
  return new FetchPostsUseCase(postsRepository)
}
