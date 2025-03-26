export interface FolderItem {
  readonly id: string;
  readonly name: string;
  readonly type: 'folder' | 'file';
  readonly extension?: string | null;
  readonly size?: number | null;
  readonly mimeType?: string | null;
  readonly owner: string;
  readonly folder: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
