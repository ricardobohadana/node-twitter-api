import { Post } from '../entities/post'
import { ContentIsTooLargeError } from '../errors/content-is-too-large.error'
import { ContentIsTooSmallError } from '../errors/content-is-too-small.error'
import { IPostsRepository } from '../interfaces/repositories/posts'
import { UseCase } from './base/use-case'

interface CreatePostUseCaseProps {
  content: string
  authorId: string
}

interface CreatePostUseCaseResponse {
  post: Post
}

export class CreatePostUseCase
  implements UseCase<CreatePostUseCaseProps, CreatePostUseCaseResponse>
{
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(data: CreatePostUseCaseProps): Promise<CreatePostUseCaseResponse> {
    if (data.content.length < 5) throw new ContentIsTooSmallError()
    if (data.content.length > 280) throw new ContentIsTooLargeError()

    const post = Post.create(data)

    await this.postsRepository.insert(post)

    return { post }
  }
}
