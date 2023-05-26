import { CreatePostUseCase } from '../../application/use-cases/create-post'
import { PrismaPostsRepository } from '../../data/repositories/prisma/posts'

export function makeCreatePostUseCase() {
  const postsRepository = new PrismaPostsRepository()
  return new CreatePostUseCase(postsRepository)
}
