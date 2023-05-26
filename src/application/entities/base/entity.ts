import { randomUUID } from 'crypto'

export interface EntityProps {
  id: string
  updatedAt?: Date
}

export abstract class Entity<Props> {
  private _id: string
  private _updatedAt?: Date | null
  protected props: Props

  get id() {
    return this._id
  }

  get updatedAt() {
    return this._updatedAt
  }

  protected touch() {
    this._updatedAt = new Date()
  }

  toJson() {
    return {
      id: this._id,
      updatedAt: this._updatedAt,
      ...this.props,
    }
  }

  protected constructor(props: Props, entityProps?: EntityProps) {
    this.props = props
    if (!entityProps) {
      this._id = randomUUID()
    } else {
      this._id = entityProps.id
      this._updatedAt = entityProps.updatedAt
    }
  }
}
