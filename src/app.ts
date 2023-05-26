import fastify from 'fastify'
import { postRoutes } from './http/routes/post.routes'
import { userRoutes } from './http/routes/user.routes'
import { verifySessionHook } from './http/hook/verify-session'
import { createReplyController } from './http/controllers/create-reply'
import { editReplyController } from './http/controllers/edit-reply'
import { deleteReplyController } from './http/controllers/delete-reply'

export const app = fastify()

app.register(userRoutes, { prefix: 'user' })
app.register(postRoutes, { prefix: 'post' })

app.post('/reply', { preHandler: verifySessionHook }, createReplyController)
app.put('/reply/:id', { preHandler: verifySessionHook }, editReplyController)
app.delete('/reply/:id', { preHandler: verifySessionHook }, deleteReplyController)
