import { PaginationMetadata } from './pagination-metadata';

export interface PaginationResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}
