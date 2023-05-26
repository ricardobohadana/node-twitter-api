import { Post } from '../entities/post'
import { IPostsRepository } from '../interfaces/repositories/posts'
import { UseCase } from './base/use-case'

interface FetchPostsUseCaseProps {
  skip: number
  take: number
}

interface FetchPostsUseCaseResponse {
  posts: Post[]
}

export class FetchPostsUseCase
  implements UseCase<FetchPostsUseCaseProps, FetchPostsUseCaseResponse>
{
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute({ skip, take }: FetchPostsUseCaseProps): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.findMany({ skip, take })

    return { posts }
  }
}
