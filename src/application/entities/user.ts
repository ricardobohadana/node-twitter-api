import { Entity, EntityProps } from './base/entity'

interface UserProps {
  username: string
  email: string
  password: string
  description?: string
  birthDate: Date
}

export class User extends Entity<UserProps> {
  get username() {
    return this.props.username
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get description() {
    return this.props.description
  }

  get birthDate() {
    return this.props.birthDate
  }

  static create(userProps: UserProps, entityProps?: EntityProps) {
    const { birthDate, email, username, password, description } = userProps
    const props = {
      birthDate,
      email,
      username,
      description,
      password,
    }
    return new User(props, entityProps)
  }
}
