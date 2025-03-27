export class FileHelper {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  static readonly MAX_FILE_SIZE_MB = 10;

  static readonly ALLOWED_FILE_TYPES: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/zip',
  ];

  static async getBlobFileFromUrl(url: string): Promise<string> {
    const fileFetched = await fetch(url);

    if (!fileFetched.ok) {
      throw new Error('Error al descargar el archivo');
    }

    const blob = await fileFetched.blob();
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  }
}
