export class FileHelper {
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
