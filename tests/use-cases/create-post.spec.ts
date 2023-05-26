import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { User } from '@/application/entities/user'
import { CreatePostUseCase } from '@/application/use-cases/create-post'
import { IPostsRepository } from '@/application/interfaces/repositories/posts'
import { ContentIsTooSmallError } from '@/application/errors/content-is-too-small.error'
import { ContentIsTooLargeError } from '@/application/errors/content-is-too-large.error'

describe('Create post use-case tests', () => {
  let postsRepository: MockProxy<IPostsRepository>
  let sutUseCase: CreatePostUseCase
  let userModel: User
  let content: string

  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ min: 16, mode: 'age' }),
    password: faker.internet.password(),
  }

  beforeEach(() => {
    postsRepository = mock<IPostsRepository>()
    sutUseCase = new CreatePostUseCase(postsRepository)
    userModel = User.create(user)
    content = faker.string.sample({ min: 10, max: 250 })
  })

  it('should be able to create a post', async () => {
    const postData = { authorId: userModel.id, content }
    const { post } = await sutUseCase.execute(postData)

    expect(postsRepository.insert).toHaveBeenCalledOnce()
    expect(post.id).toBeTruthy()
  })

  it('should not be able to create a post with content length lower than 5', async () => {
    const postData = { authorId: userModel.id, content: 'abcd' }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooSmallError,
    )
    expect(postsRepository.insert).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a post with content length greater than 5', async () => {
    const postData = {
      authorId: userModel.id,
      content: faker.string.sample({ min: 300, max: 400 }),
    }

    await expect(async () => await sutUseCase.execute(postData)).rejects.toBeInstanceOf(
      ContentIsTooLargeError,
    )
    expect(postsRepository.insert).not.toHaveBeenCalledOnce()
  })
})
