import { FolderRelated } from './folder-related';
import { FolderItem } from './folder-item';
import { PaginationResponse } from 'src/app/shared/models/pagination-response';

export interface FolderContent {
  readonly folders: FolderRelated[];
  readonly items: PaginationResponse<FolderItem>;
}
