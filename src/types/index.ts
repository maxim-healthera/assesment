export type ID = number;

export type CreateSuccessResponse = {
  success: true;
  id: ID;
};

export type EntitySelectFields<T> = (keyof T)[];

export type FindOneCustomOptions<T> = Partial<
  Record<'select' | 'relations', EntitySelectFields<T>>
>;
