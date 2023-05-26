import { FastifyInstance } from 'fastify'
import { verifySessionHook } from '../hook/verify-session'
import { createPostController } from '../controllers/create-post'
import { deletePostController } from '../controllers/delete-post'
import { editPostController } from '../controllers/edit-post'

export async function postRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifySessionHook)
  app.post('/', createPostController)
  app.put('/:id', editPostController)
  app.delete('/:id', deletePostController)
}
