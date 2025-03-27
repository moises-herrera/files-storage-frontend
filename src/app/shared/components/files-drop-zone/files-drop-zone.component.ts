import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileService } from 'src/app/core/services/file.service';
import { FileDraggingDetectorDirective } from 'src/app/shared/directives/file-dragging-detector.directive';
import { FileHelper } from 'src/app/shared/helpers/file-helper';

@Component({
  selector: 'app-files-drop-zone',
  imports: [CommonModule, FileDraggingDetectorDirective],
  templateUrl: './files-drop-zone.component.html',
  styleUrl: './files-drop-zone.component.css',
})
export class FilesDropZoneComponent {
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);

  styleClass = input<string>('mt-3 min-h-[calc(100vh-212px)]');

  folderId = input<string>('');

  onUploadComplete = output<void>();

  isDragging = signal<boolean>(false);

  filesUploaded = signal<FileList | null>(null);

  uploadFiles(files: FileList): void {
    const fileArray = Array.from(files);

    const hasBigFile = fileArray.some(
      (file) => file.size > FileHelper.MAX_FILE_SIZE
    );

    if (hasBigFile) {
      this.alertService.displayMessage({
        severity: 'error',
        summary: 'Error',
        detail: `El tamaño máximo para archivos es ${FileHelper.MAX_FILE_SIZE_MB} MB`,
      });
      return;
    }

    const hasInvalidFileType = fileArray.some(
      (file) => FileHelper.ALLOWED_FILE_TYPES.indexOf(file.type) === -1
    );

    if (hasInvalidFileType) {
      this.alertService.displayMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Tipo de archivo no permitido',
      });
      return;
    }

    this.alertService.displayMessage({
      severity: 'info',
      summary: 'Subiendo archivos',
      detail: 'Por favor, espere...',
      sticky: true,
    });

    this.fileService.uploadFile(files, this.folderId()).subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Los archivos se han subido correctamente',
        });
        this.alertService.clearMessages();
        this.onUploadComplete.emit();
      },
      error: () => {
        this.alertService.clearMessages();
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir los archivos',
        });
      },
    });
  }
}
