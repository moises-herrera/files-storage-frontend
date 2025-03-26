import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  readonly KB = 1024;
  readonly MB = this.KB * 1024;
  readonly GB = this.MB * 1024;

  transform(value: number): string {
    if (!value) return '';

    if (value < this.KB) {
      return `${value} B`;
    }

    if (value < this.MB) {
      return `${(value / this.KB).toFixed(2)} KB`;
    }

    if (value < this.GB) {
      return `${(value / this.MB).toFixed(2)} MB`;
    }

    return `${(value / this.GB).toFixed(2)} GB`;
  }
}
