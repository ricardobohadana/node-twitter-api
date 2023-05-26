import { ContentIsTooLargeError } from '../../errors/content-is-too-large.error'
import { ContentIsTooSmallError } from '../../errors/content-is-too-small.error'
import { Entity } from './entity'

export interface PostProps {
  authorId: string
  content: string
  createdAt: Date
}

export abstract class BasePost<Props extends PostProps> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(value: string) {
    if (value.length < 5) throw new ContentIsTooSmallError()
    if (value.length > 280) throw new ContentIsTooLargeError()
    this.props.content = value
    this.touch()
  }
}
