import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateReplyUseCase } from '../factories/make-create-reply'
import { ContentIsTooLargeError } from '../../application/errors/content-is-too-large.error'
import { ContentIsTooSmallError } from '../../application/errors/content-is-too-small.error'

const createReplyBodySchema = z.object({
  postId: z.string().uuid(),
  content: z.string(),
})

export async function createReplyController(request: FastifyRequest, reply: FastifyReply) {
  const { content, postId } = createReplyBodySchema.parse(request.body)
  const authorId = request.user!.id

  const useCase = makeCreateReplyUseCase()

  try {
    const { reply: replyClass } = await useCase.execute({ authorId, content, postId })
    return reply.status(201).send({ reply: replyClass.toJson() })
  } catch (error) {
    if (error instanceof ContentIsTooSmallError || error instanceof ContentIsTooLargeError)
      return reply.status(400).send({ message: error.message })
    return reply.status(500).send()
  }
}
