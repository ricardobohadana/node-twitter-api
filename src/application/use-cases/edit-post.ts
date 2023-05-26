import { Post } from '../entities/post'
import { EntityNotFoundError } from '../errors/entity-not-found.error'
import { NotAllowedError } from '../errors/not-allowed.error'
import { IPostsRepository } from '../interfaces/repositories/posts'
import { UseCase } from './base/use-case'

interface EditPostUseCaseProps {
  id: string
  content: string
  authorId: string
}

interface EditPostUseCaseResponse {
  post: Post
}

export class EditPostUseCase
  implements UseCase<EditPostUseCaseProps, EditPostUseCaseResponse>
{
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute({
    id,
    content,
    authorId,
  }: EditPostUseCaseProps): Promise<EditPostUseCaseResponse> {
    const post = await this.postsRepository.find(id)

    if (!post) throw new EntityNotFoundError('Post')
    if (post.authorId !== authorId) throw new NotAllowedError()

    post.content = content

    await this.postsRepository.update(post)

    return { post }
  }
}
