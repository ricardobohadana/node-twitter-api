import { Post } from '../../../application/entities/post'
import { RepositoryFilterProps } from '../../../application/interfaces/repositories/base/repository'
import { IPostsRepository } from '../../../application/interfaces/repositories/posts'
import { prisma } from '../../prisma/client'
import { Post as PostModel } from '@prisma/client'

export class PrismaPostsRepository implements IPostsRepository {
  async delete({ id }: Post): Promise<void> {
    await prisma.post.delete({ where: { id } })
  }

  private fromDatabaseModelToEntity({
    authorId,
    content,
    id,
    updatedAt,
    createdAt,
  }: PostModel): Post {
    return Post.create(
      { authorId, content, createdAt },
      { id, updatedAt: updatedAt ?? undefined },
    )
  }

  async insert({ authorId, content, id, updatedAt }: Post): Promise<void> {
    await prisma.post.create({ data: { id, authorId, content, updatedAt } })
  }

  async find(id: string): Promise<Post | null> {
    const postModel = await prisma.post.findUnique({ where: { id } })
    if (!postModel) return null
    return this.fromDatabaseModelToEntity(postModel)
  }

  async findMany({ skip, take }: RepositoryFilterProps): Promise<Post[]> {
    const postsModel = await prisma.post.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })

    return postsModel.map(this.fromDatabaseModelToEntity)
  }

  async update({ id, authorId, content, updatedAt }: Post): Promise<void> {
    await prisma.post.update({ where: { id }, data: { content, updatedAt } })
  }
}
