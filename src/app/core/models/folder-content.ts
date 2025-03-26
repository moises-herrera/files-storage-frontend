import { Folder } from './folder';
import { FolderItem } from './folder-item';
import { PaginationResponse } from 'src/app/shared/models/pagination-response';

export interface FolderContent {
  readonly folders: Folder[];
  readonly items: PaginationResponse<FolderItem>;
}
