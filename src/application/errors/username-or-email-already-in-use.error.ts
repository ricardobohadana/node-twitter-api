export class UsernameOrEmailAlreadyInUseError extends Error {
  constructor() {
    super('Username or email already in use')
  }
}
