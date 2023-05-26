export class AuthenticationExpiredError extends Error {
  constructor() {
    super('Authentication expired')
  }
}
