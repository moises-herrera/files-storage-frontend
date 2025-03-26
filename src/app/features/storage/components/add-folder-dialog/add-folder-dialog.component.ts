import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';

@Component({
  selector: 'app-add-folder-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './add-folder-dialog.component.html',
  styleUrl: './add-folder-dialog.component.css',
})
export class AddFolderDialogComponent {
  private readonly folderService = inject(FolderService);
  private readonly alertService = inject(AlertService);

  currentFolderId = input<string>('');

  isDialogVisible = input<boolean>(false);

  closeDialog = output<boolean>();

  defaultFolderName = 'Carpeta sin título';

  folderName = signal<string>(this.defaultFolderName);

  createFolder(): void {
    this.folderService
      .addFolder(this.folderName(), this.currentFolderId())
      .subscribe({
        next: () => {
          this.alertService.displayMessage({
            severity: 'success',
            summary: 'Carpeta creada',
            detail: 'La carpeta se ha creado correctamente',
          });
          this.emitCloseEvent(true);
        },
        error: () => {
          this.alertService.displayMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la carpeta',
          });
          this.emitCloseEvent();
        },
      });
  }

  emitCloseEvent(reload = false): void {
    this.closeDialog.emit(reload);
    this.folderName.set(this.defaultFolderName);
  }
}
