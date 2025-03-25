export interface FolderItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'folder' | 'file';
  readonly extension: string;
  readonly size: number;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly owner: string;
  readonly folder: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
