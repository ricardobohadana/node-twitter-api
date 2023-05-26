import { beforeEach, describe, expect, it } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'
import { Reply } from '@/application/entities/reply'
import { randomUUID } from 'crypto'
import { IReplyRepository } from '@/application/interfaces/repositories/reply'
import { NotAllowedError } from '@/application/errors/not-allowed.error'
import { DeleteReplyUseCase } from '@/application/use-cases/delete-reply'

describe('Delete reply use-case tests', () => {
  let replyRepository: MockProxy<IReplyRepository>
  let sutUseCase: DeleteReplyUseCase
  let replyModel: Reply
  let content: string

  beforeEach(() => {
    replyRepository = mock<IReplyRepository>()
    sutUseCase = new DeleteReplyUseCase(replyRepository)
    content = 'this is the deleted version of the tweet'
    replyModel = Reply.create({
      postId: randomUUID(),
      authorId: randomUUID(),
      content,
    })
    replyRepository.find.mockImplementation(async () => replyModel)
  })

  it('should be able to delete a reply', async () => {
    await sutUseCase.execute({
      id: replyModel.id,
      authorId: replyModel.authorId,
    })

    expect(replyRepository.delete).toHaveBeenCalledOnce()
  })

  it('should not be able to delete a reply if you are not the author', async () => {
    const replyData = { id: replyModel.id, authorId: randomUUID() }

    await expect(async () => await sutUseCase.execute(replyData)).rejects.toBeInstanceOf(
      NotAllowedError,
    )
    expect(replyRepository.delete).not.toHaveBeenCalledOnce()
  })
})
