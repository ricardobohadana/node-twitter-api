import { Post } from '../../entities/post'
import { IRepository } from './base/repository'

export interface IPostsRepository extends IRepository<Post> {}
