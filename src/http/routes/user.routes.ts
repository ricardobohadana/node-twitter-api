import { FastifyInstance } from 'fastify'
import { authenticateUserController } from '../controllers/authenticate-user'
import { createUserController } from '../controllers/create-user'

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', createUserController)
  app.post('/authenticate', authenticateUserController)
}
