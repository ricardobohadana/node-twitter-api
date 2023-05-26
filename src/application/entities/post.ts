import { BasePost, PostProps } from './base/base-post'
import { EntityProps } from './base/entity'

interface CreatePostProps {
  authorId: string
  content: string
  createdAt?: Date
}

export class Post extends BasePost<PostProps> {
  static create(props: CreatePostProps, entityProps?: EntityProps) {
    const postProps = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }
    return new Post(postProps, entityProps)
  }
}
