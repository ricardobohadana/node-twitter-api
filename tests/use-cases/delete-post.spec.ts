import { beforeEach, describe, expect, it } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'
import { IPostsRepository } from '@/application/interfaces/repositories/posts'
import { Post } from '@/application/entities/post'
import { randomUUID } from 'crypto'
import { NotAllowedError } from '@/application/errors/not-allowed.error'
import { DeletePostUseCase } from '@/application/use-cases/delete-post'

describe('Delete post use-case tests', () => {
  let postsRepository: MockProxy<IPostsRepository>
  let sutUseCase: DeletePostUseCase
  let postModel: Post
  let content: string

  beforeEach(() => {
    postsRepository = mock<IPostsRepository>()
    sutUseCase = new DeletePostUseCase(postsRepository)
    content = 'this is the deleted version of the tweet'
    postModel = Post.create({ authorId: randomUUID(), content })
    postsRepository.find.mockImplementation(async () => postModel)
  })

  it('should be able to delete a post', async () => {
    await sutUseCase.execute({
      id: postModel.id,
      authorId: postModel.authorId,
    })

    expect(postsRepository.delete).toHaveBeenCalledOnce()
  })

  it('should not be able to delete a post with if you are not the author', async () => {
    const postData = { id: postModel.id, authorId: randomUUID() }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      NotAllowedError,
    )
    expect(postsRepository.delete).not.toHaveBeenCalledOnce()
  })
})
