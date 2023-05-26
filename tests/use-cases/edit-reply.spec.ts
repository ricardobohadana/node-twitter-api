import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { ContentIsTooSmallError } from '@/application/errors/content-is-too-small.error'
import { ContentIsTooLargeError } from '@/application/errors/content-is-too-large.error'
import { Reply } from '@/application/entities/reply'
import { randomUUID } from 'crypto'
import { EditReplyUseCase } from '@/application/use-cases/edit-reply'
import { IReplyRepository } from '@/application/interfaces/repositories/reply'
import { NotAllowedError } from '@/application/errors/not-allowed.error'

describe('Edit reply use-case tests', () => {
  let replyRepository: MockProxy<IReplyRepository>
  let sutUseCase: EditReplyUseCase
  let replyModel: Reply
  let content: string
  let oldContent: string

  beforeEach(() => {
    replyRepository = mock<IReplyRepository>()
    sutUseCase = new EditReplyUseCase(replyRepository)
    oldContent = 'this is a tweet'
    content = 'this is the updated version of the tweet'
    replyModel = Reply.create({
      postId: randomUUID(),
      authorId: randomUUID(),
      content: oldContent,
    })
    replyRepository.find.mockImplementation(async () => replyModel)
  })

  it('should be able to update a reply', async () => {
    const { reply } = await sutUseCase.execute({
      id: replyModel.id,
      content,
      authorId: replyModel.authorId,
    })

    expect(replyRepository.update).toHaveBeenCalledOnce()
    expect(reply.id).toEqual(replyModel.id)
    expect(reply.content).not.toEqual(oldContent)
  })

  it('should not be able to update a reply if you are not the author', async () => {
    const replyData = { id: replyModel.id, content: 'abcd', authorId: randomUUID() }

    await expect(async () => await sutUseCase.execute(replyData)).rejects.toBeInstanceOf(
      NotAllowedError,
    )
    expect(replyRepository.update).not.toHaveBeenCalledOnce()
  })

  it('should not be able to update a reply with content length lower than 5', async () => {
    const replyData = { id: replyModel.id, content: 'abcd', authorId: replyModel.authorId }

    await expect(async () => await sutUseCase.execute(replyData)).rejects.toBeInstanceOf(
      ContentIsTooSmallError,
    )
    expect(replyRepository.update).not.toHaveBeenCalledOnce()
  })

  it('should not be able to update a reply with content length greater than 5', async () => {
    const replyData = {
      id: replyModel.id,
      content: faker.string.sample({ min: 300, max: 400 }),
      authorId: replyModel.authorId,
    }

    await expect(async () => await sutUseCase.execute(replyData)).rejects.toBeInstanceOf(
      ContentIsTooLargeError,
    )
    expect(replyRepository.update).not.toHaveBeenCalledOnce()
  })
})
