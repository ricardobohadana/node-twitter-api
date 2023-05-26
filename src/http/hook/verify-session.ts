import { FastifyReply, FastifyRequest } from 'fastify'
import { makeVerifySessionUseCase } from '../factories/make-verify-session'
import { z } from 'zod'

const verifySessionSchema = z.object({
  sessionId: z.string(),
})

export async function verifySessionHook(request: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = verifySessionSchema.parse(request.body)
  const useCase = makeVerifySessionUseCase()
  const { user } = await useCase.execute({ sessionId })
  request.user = user
}
