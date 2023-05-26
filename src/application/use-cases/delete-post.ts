import { EntityNotFoundError } from '../errors/entity-not-found.error'
import { NotAllowedError } from '../errors/not-allowed.error'
import { IPostsRepository } from '../interfaces/repositories/posts'
import { UseCase } from './base/use-case'

interface DeletePostUseCaseProps {
  id: string
  authorId: string
}

export class DeletePostUseCase implements UseCase<DeletePostUseCaseProps, void> {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute({ id, authorId }: DeletePostUseCaseProps): Promise<void> {
    const post = await this.postsRepository.find(id)

    if (!post) throw new EntityNotFoundError('Post')
    if (post.authorId !== authorId) throw new NotAllowedError()

    await this.postsRepository.delete(post)
  }
}
