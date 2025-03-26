export interface Folder {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly parentFolder?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
