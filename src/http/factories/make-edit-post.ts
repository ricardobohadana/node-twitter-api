import { EditPostUseCase } from '../../application/use-cases/edit-post'
import { PrismaPostsRepository } from '../../data/repositories/prisma/posts'

export function makeEditPostUseCase() {
  const postRepository = new PrismaPostsRepository()
  return new EditPostUseCase(postRepository)
}
