export class ContentIsTooLargeError extends Error {
  constructor() {
    super('content is too large')
  }
}
