import { z } from 'zod'

import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthenticationError } from '../../application/errors/authentication.error'
import { makeAuthenticateUserUseCase } from '../factories/make-authenticate-user'

const authenticateUseSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authenticateUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateUseSchema.parse(request.body)
  const useCase = makeAuthenticateUserUseCase()

  try {
    const { user, sessionId } = await useCase.execute({ email, password })
    return reply.status(200).send({ user, sessionId })
  } catch (error) {
    console.log(error)
    if (error instanceof AuthenticationError)
      return reply.status(401).send({ message: error.message })
    return reply.status(500).send()
  }
}
