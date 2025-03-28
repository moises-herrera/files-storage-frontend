import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
  transform(extension: string): string {
    if (!extension) return 'Archivo';

    return `Archivo ${extension.toUpperCase()}`;
  }
}
