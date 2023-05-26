export class ContentIsTooSmallError extends Error {
  constructor() {
    super('Post content is too small')
  }
}
