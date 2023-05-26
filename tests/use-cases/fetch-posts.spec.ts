import { beforeEach, describe, expect, it } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'
import { IPostsRepository } from '@/application/interfaces/repositories/posts'
import { FetchPostsUseCase } from '@/application/use-cases/fetch-posts'
import { Post } from '@/application/entities/post'
import { randomUUID } from 'crypto'

describe('Fetch posts use case tests', () => {
  let postsRepository: MockProxy<IPostsRepository>
  let sutUseCase: FetchPostsUseCase
  const posts: Post[] = []

  beforeEach(() => {
    postsRepository = mock<IPostsRepository>()
    postsRepository.findMany.mockImplementation(async ({ skip, take }) =>
      posts.filter((p, index) => index >= skip && index < skip + take),
    )
    sutUseCase = new FetchPostsUseCase(postsRepository)

    for (let index = 0; index < 20; index++) {
      const post = Post.create({
        authorId: randomUUID(),
        content: 'this is not a random content',
      })
      posts.push(post)
    }
  })

  it('should be able to fetch posts', async () => {
    const skip = 0
    const take = 10

    const { posts } = await sutUseCase.execute({ skip, take })

    expect(posts).toHaveLength(take)
  })
})
