import { Reply } from '../../../application/entities/reply'
import { RepositoryFilterProps } from '../../../application/interfaces/repositories/base/repository'
import { IReplyRepository } from '../../../application/interfaces/repositories/reply'
import { prisma } from '../../prisma/client'

import { Reply as ReplyModel } from '@prisma/client'

export class PrismaReplyRepository implements IReplyRepository {
  fromDatabaseModelToEntity({
    id,
    postId,
    authorId,
    content,
    createdAt,
    updatedAt,
  }: ReplyModel): Reply {
    return Reply.create(
      { authorId, content, createdAt, postId },
      { id, updatedAt: updatedAt ?? undefined },
    )
  }

  async insert({ authorId, content, id, postId }: Reply): Promise<void> {
    await prisma.reply.create({ data: { content, authorId, id, postId } })
  }

  async find(id: string): Promise<Reply | null> {
    const model = await prisma.reply.findUnique({ where: { id } })

    if (!model) return null
    return this.fromDatabaseModelToEntity(model)
  }

  async findMany({ skip, take }: RepositoryFilterProps): Promise<Reply[]> {
    const models = await prisma.reply.findMany({ skip, take })
    return models.map(this.fromDatabaseModelToEntity)
  }

  async update({ id, content, updatedAt }: Reply): Promise<void> {
    await prisma.reply.update({ where: { id }, data: { content, updatedAt } })
  }

  async delete({ id }: Reply): Promise<void> {
    await prisma.reply.delete({ where: { id } })
  }
}
