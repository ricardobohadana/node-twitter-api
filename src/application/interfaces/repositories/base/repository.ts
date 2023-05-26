export interface RepositoryFilterProps {
  skip: number
  take: number
}

export interface IRepository<Entity> {
  insert(entity: Entity): Promise<void>
  find(id: string): Promise<Entity | null>
  findMany(data: RepositoryFilterProps): Promise<Entity[]>
  update(entity: Entity): Promise<void>
  delete(entity: Entity): Promise<void>
}
