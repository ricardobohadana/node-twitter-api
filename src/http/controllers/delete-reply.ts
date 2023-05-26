import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EntityNotFoundError } from '../../application/errors/entity-not-found.error'
import { NotAllowedError } from '../../application/errors/not-allowed.error'
import { makeDeleteReplyUseCase } from '../factories/make-delete-reply'

const deleteReplyParamSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteReplyController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteReplyParamSchema.parse(request.params)
  const authorId = request.user!.id
  const useCase = makeDeleteReplyUseCase()

  try {
    await useCase.execute({ id, authorId })
    return reply.status(200).send()
  } catch (error) {
    if (error instanceof EntityNotFoundError)
      return reply.status(400).send({ message: error.message })
    if (error instanceof NotAllowedError)
      return reply.status(401).send({ message: error.message })
    return reply.status(500)
  }
}
