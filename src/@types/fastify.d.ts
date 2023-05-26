/* eslint-disable no-unused-vars */
import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { User } from '../application/entities/user'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: User
  }
}
