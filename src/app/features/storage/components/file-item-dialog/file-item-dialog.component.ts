import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FolderItem } from 'src/app/core/models/folder-item';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-file-item-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './file-item-dialog.component.html',
  styleUrl: './file-item-dialog.component.css',
})
export class FileItemDialogComponent {
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);

  parentFolderId = input<string>('');

  folderItemData = input<FolderItem | null>(null);

  fileItemName = signal<string>('');

  isDialogVisible = input<boolean>(false);

  closeDialog = output<boolean>();

  constructor() {
    effect(() => {
      if (this.folderItemData()?.id) {
        this.fileItemName.set(this.folderItemData()?.name || '');
      } else {
        this.fileItemName.set('');
      }
    });
  }

  saveFile(): void {
    this.fileService
      .updateFile(this.folderItemData()?.id || '', this.fileItemName())
      .subscribe({
        next: () => {
          this.alertService.displayMessage({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivo renombrado correctamente',
          });
          this.emitCloseEvent(true);
        },
        error: () => {
          this.alertService.displayMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al renombrar el archivo',
          });
          this.emitCloseEvent();
        },
      });
  }

  emitCloseEvent(reload = false): void {
    this.closeDialog.emit(reload);
  }
}
