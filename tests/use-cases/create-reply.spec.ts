import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { IPostsRepository } from '@/application/interfaces/repositories/posts'
import { ContentIsTooSmallError } from '@/application/errors/content-is-too-small.error'
import { ContentIsTooLargeError } from '@/application/errors/content-is-too-large.error'
import { IReplyRepository } from '@/application/interfaces/repositories/reply'
import { CreateReplyUseCase } from '@/application/use-cases/create-reply'
import { randomUUID } from 'crypto'
import { Post } from '@/application/entities/post'
import { EntityNotFoundError } from '@/application/errors/entity-not-found.error'

describe('Reply post use-case tests', () => {
  let postsRepository: MockProxy<IPostsRepository>
  let replyRepository: MockProxy<IReplyRepository>
  let sutUseCase: CreateReplyUseCase
  let post: Post
  let content: string

  beforeEach(() => {
    postsRepository = mock<IPostsRepository>()
    postsRepository.find.mockImplementation(async (id) => (id === post.id ? post : null))

    replyRepository = mock<IReplyRepository>()
    sutUseCase = new CreateReplyUseCase(replyRepository, postsRepository)
    content = faker.string.sample({ min: 10, max: 250 })
    post = Post.create({ authorId: randomUUID(), content })
  })

  it('should be able to create a reply to a post', async () => {
    const postData = { postId: post.id, authorId: randomUUID(), content }
    const { reply } = await sutUseCase.execute(postData)

    expect(replyRepository.insert).toHaveBeenCalledOnce()
    expect(reply.id).toBeTruthy()
  })

  it('should not be able to create a reply to an unexisting post', async () => {
    const postData = { postId: randomUUID(), authorId: randomUUID(), content }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      EntityNotFoundError,
    )
    expect(replyRepository.insert).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a reply with content length lower than 5', async () => {
    const postData = { postId: post.id, authorId: randomUUID(), content: 'abcd' }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooSmallError,
    )
    expect(replyRepository.insert).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a reply with content length greater than 5', async () => {
    const postData = {
      postId: post.id,
      authorId: randomUUID(),
      content: faker.string.sample({ min: 300, max: 400 }),
    }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooLargeError,
    )
    expect(replyRepository.insert).not.toHaveBeenCalledOnce()
  })
})
