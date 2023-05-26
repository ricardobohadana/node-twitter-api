export class UserUnderageError extends Error {
  constructor() {
    super('User is not old enough')
  }
}
