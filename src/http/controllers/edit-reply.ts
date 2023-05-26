import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { NotAllowedError } from '../../application/errors/not-allowed.error'
import { EntityNotFoundError } from '../../application/errors/entity-not-found.error'
import { makeEditReplyUseCase } from '../factories/make-edit-reply'

const editReplyBodySchema = z.object({
  content: z.string(),
})

const editReplyParamSchema = z.object({
  id: z.string().uuid(),
})

export async function editReplyController(request: FastifyRequest, reply: FastifyReply) {
  const { content } = editReplyBodySchema.parse(request.body)
  const { id } = editReplyParamSchema.parse(request.params)

  const authorId = request.user!.id

  const useCase = makeEditReplyUseCase()
  try {
    const { reply: replyClass } = await useCase.execute({ id, authorId, content })
    return reply.status(202).send({ reply: replyClass.toJson() })
  } catch (error) {
    if (error instanceof EntityNotFoundError)
      return reply.status(400).send({ message: error.message })
    if (error instanceof NotAllowedError)
      return reply.status(401).send({ message: error.message })

    console.error(error)
    return reply.status(500).send()
  }
}
