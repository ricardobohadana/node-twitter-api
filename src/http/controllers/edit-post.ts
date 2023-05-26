import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeEditPostUseCase } from '../factories/make-edit-post'
import { NotAllowedError } from '../../application/errors/not-allowed.error'
import { EntityNotFoundError } from '../../application/errors/entity-not-found.error'

const editPostBodySchema = z.object({
  content: z.string(),
})

const editPostParamSchema = z.object({
  id: z.string(),
})

export async function editPostController(request: FastifyRequest, reply: FastifyReply) {
  const { content } = editPostBodySchema.parse(request.body)
  const { id } = editPostParamSchema.parse(request.params)

  const authorId = request.user!.id

  const useCase = makeEditPostUseCase()
  try {
    const { post } = await useCase.execute({ id, authorId, content })
    return reply.status(202).send({ post: post.toJson() })
  } catch (error) {
    if (error instanceof EntityNotFoundError)
      return reply.status(400).send({ message: error.message })
    if (error instanceof NotAllowedError)
      return reply.status(401).send({ message: error.message })

    return reply.status(500).send()
  }
}
