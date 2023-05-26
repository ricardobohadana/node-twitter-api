import { FastifyReply, FastifyRequest } from 'fastify'
import { makeDeletePostUseCase } from '../factories/make-delete-post'
import { z } from 'zod'
import { EntityNotFoundError } from '../../application/errors/entity-not-found.error'
import { NotAllowedError } from '../../application/errors/not-allowed.error'

const deletePostParamSchema = z.object({
  id: z.string().uuid(),
})

export async function deletePostController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deletePostParamSchema.parse(request.params)
  const authorId = request.user!.id
  const useCase = makeDeletePostUseCase()

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
