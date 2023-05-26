import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateUserUseCase } from '../factories/make-create-user'
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  birthDate: z.coerce.date(),
  password: z.string(),
})

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const createUserData = createUserSchema.parse(request.body)
  const useCase = makeCreateUserUseCase()
  try {
    await useCase.execute(createUserData)
    return reply.status(201).send()
  } catch (error) {
    console.error(error)
    return reply.status(500).send()
  }
}
