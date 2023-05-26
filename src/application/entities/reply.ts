import { BasePost, PostProps } from './base/base-post'
import { EntityProps } from './base/entity'

interface CreateReplyProps {
  postId: string
  authorId: string
  content: string
  createdAt?: Date
}

interface ReplyProps extends PostProps {
  postId: string
}

export class Reply extends BasePost<ReplyProps> {
  get postId() {
    return this.props.postId
  }

  static create(props: CreateReplyProps, entityProps?: EntityProps) {
    const replyProps: ReplyProps = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }
    return new Reply(replyProps, entityProps)
  }
}
