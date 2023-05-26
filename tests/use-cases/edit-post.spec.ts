import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { IPostsRepository } from '@/application/interfaces/repositories/posts'
import { ContentIsTooSmallError } from '@/application/errors/content-is-too-small.error'
import { ContentIsTooLargeError } from '@/application/errors/content-is-too-large.error'
import { EditPostUseCase } from '@/application/use-cases/edit-post'
import { Post } from '@/application/entities/post'
import { randomUUID } from 'crypto'
import { NotAllowedError } from '@/application/errors/not-allowed.error'

describe('Edit post use-case tests', () => {
  let postsRepository: MockProxy<IPostsRepository>
  let sutUseCase: EditPostUseCase
  let postModel: Post
  let content: string
  let oldContent: string

  beforeEach(() => {
    postsRepository = mock<IPostsRepository>()
    sutUseCase = new EditPostUseCase(postsRepository)
    oldContent = 'this is a tweet'
    content = 'this is the updated version of the tweet'
    postModel = Post.create({ authorId: randomUUID(), content: oldContent })
    postsRepository.find.mockImplementation(async () => postModel)
  })

  it('should be able to update a post', async () => {
    const { post } = await sutUseCase.execute({
      id: postModel.id,
      content,
      authorId: postModel.authorId,
    })

    expect(postsRepository.update).toHaveBeenCalledOnce()
    expect(post.id).toEqual(postModel.id)
    expect(post.content).not.toEqual(oldContent)
  })

  it('should not be able to update a post with if you are not the author', async () => {
    const postData = { id: postModel.id, content: 'abcd', authorId: randomUUID() }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      NotAllowedError,
    )
    expect(postsRepository.update).not.toHaveBeenCalledOnce()
  })

  it('should not be able to update a post with content length lower than 5', async () => {
    const postData = { id: postModel.id, content: 'abcd', authorId: postModel.authorId }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooSmallError,
    )
    expect(postsRepository.update).not.toHaveBeenCalledOnce()
  })

  it('should not be able to update a post with content length greater than 5', async () => {
    const postData = {
      id: postModel.id,
      content: faker.string.sample({ min: 300, max: 400 }),
      authorId: postModel.authorId,
    }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooLargeError,
    )
    expect(postsRepository.update).not.toHaveBeenCalledOnce()
  })
})
