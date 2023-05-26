import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreatePostUseCase } from '../factories/make-create-post'
import { z } from 'zod'
import { ContentIsTooLargeError } from '../../application/errors/content-is-too-large.error'
import { ContentIsTooSmallError } from '../../application/errors/content-is-too-small.error'

const createPostSchema = z.object({
  content: z.string(),
})

export async function createPostController(request: FastifyRequest, reply: FastifyReply) {
  const { content } = createPostSchema.parse(request.body)
  const authorId = request.user!.id // for the request to reach this far, the user must not be null
  const useCase = makeCreatePostUseCase()

  try {
    const { post } = await useCase.execute({ authorId, content })
    return reply.status(201).send({ post: post.toJson() })
  } catch (error) {
    if (error instanceof ContentIsTooSmallError || error instanceof ContentIsTooLargeError)
      return reply.status(400).send({ message: error.message })
    return reply.status(500).send()
  }
}
