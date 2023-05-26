import { Reply } from '../entities/reply'
import { ContentIsTooLargeError } from '../errors/content-is-too-large.error'
import { ContentIsTooSmallError } from '../errors/content-is-too-small.error'
import { EntityNotFoundError } from '../errors/entity-not-found.error'
import { IPostsRepository } from '../interfaces/repositories/posts'
import { IReplyRepository } from '../interfaces/repositories/reply'
import { UseCase } from './base/use-case'

interface CreateReplyUseCaseProps {
  authorId: string
  postId: string
  content: string
}

interface CreateReplyUseCaseResponse {
  reply: Reply
}

export class CreateReplyUseCase
  implements UseCase<CreateReplyUseCaseProps, CreateReplyUseCaseResponse>
{
  constructor(
    private readonly replyRepository: IReplyRepository,
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(data: CreateReplyUseCaseProps): Promise<CreateReplyUseCaseResponse> {
    const post = await this.postsRepository.find(data.postId)
    if (!post) throw new EntityNotFoundError('Post')

    if (data.content.length < 5) throw new ContentIsTooSmallError()
    if (data.content.length > 280) throw new ContentIsTooLargeError()

    const reply = Reply.create(data)

    await this.replyRepository.insert(reply)

    return { reply }
  }
}
