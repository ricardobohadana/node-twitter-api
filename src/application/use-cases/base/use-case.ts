export abstract class UseCase<T, K> {
  abstract execute(data: T): Promise<K>
}
