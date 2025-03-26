import { FolderItemPermission } from './folder-permission';

export interface Folder {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly parentFolder?: string | null;
  readonly permissions?: FolderItemPermission[];
}
