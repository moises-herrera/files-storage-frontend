import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, of } from 'rxjs';
import { Folder } from 'src/app/core/models/folder';
import { FolderItem } from 'src/app/core/models/folder-item';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';

@Component({
  selector: 'app-folder-item-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './folder-item-dialog.component.html',
  styleUrl: './folder-item-dialog.component.css',
})
export class FolderItemDialogComponent {
  private readonly folderService = inject(FolderService);
  private readonly alertService = inject(AlertService);

  defaultFolderItemName = 'Carpeta sin título';

  parentFolderId = input<string>('');

  folderItemData = input<FolderItem | null>(null);

  folderItemName = signal<string>(this.defaultFolderItemName);

  isDialogVisible = input<boolean>(false);

  closeDialog = output<boolean>();

  dialogTitle = computed<string>(() => {
    return this.folderItemData()?.id ? 'Renombrar carpeta' : 'Nueva carpeta';
  });

  dialogButtonLabel = computed<string>(() => {
    return this.folderItemData()?.id ? 'Renombrar' : 'Crear';
  });

  constructor() {
    effect(() => {
      if (this.folderItemData()?.id) {
        this.folderItemName.set(
          this.folderItemData()?.name || this.defaultFolderItemName
        );
      } else {
        this.folderItemName.set(this.defaultFolderItemName);
      }
    });
  }

  saveFolder(): void {
    const observable$ = !this.folderItemData()?.id
      ? this.createFolder()
      : this.updateFolder();

    observable$.subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Carpeta guardada',
          detail: 'La carpeta se ha guardado correctamente',
        });
        this.emitCloseEvent(true);
      },
      error: () => {
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la carpeta',
        });
        this.emitCloseEvent();
      },
    });
  }

  createFolder(): Observable<Folder> {
    return this.folderService.addFolder(
      this.folderItemName(),
      this.parentFolderId()
    );
  }

  updateFolder(): Observable<Folder> {
    if (!this.folderItemData()?.id) return of();

    return this.folderService.updateFolder(
      this.folderItemData()?.id ?? '',
      this.folderItemName()
    );
  }

  emitCloseEvent(reload = false): void {
    this.closeDialog.emit(reload);
  }
}
