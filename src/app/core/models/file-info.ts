export interface FileInfo {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly size: number;
  readonly mimeType: string;
  readonly owner: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
  };
  readonly folder: {
    readonly id: string;
    readonly name: string;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
