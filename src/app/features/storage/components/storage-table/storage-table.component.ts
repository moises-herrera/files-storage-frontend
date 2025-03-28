import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { FolderItem } from 'src/app/core/models/folder-item';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileService } from 'src/app/core/services/file.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { FileHelper } from 'src/app/shared/helpers/file-helper';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';
import { FolderItemDialogComponent } from 'src/app/features/storage/components/folder-item-dialog/folder-item-dialog.component';
import { FileItemDialogComponent } from 'src/app/features/storage/components/file-item-dialog/file-item-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileTypePipe } from 'src/app/shared/pipes/file-type.pipe';

@Component({
  selector: 'app-storage-table',
  imports: [
    CommonModule,
    TableModule,
    ContextMenuModule,
    FileSizePipe,
    FolderItemDialogComponent,
    FileItemDialogComponent,
    ConfirmDialogModule,
    FileTypePipe,
  ],
  templateUrl: './storage-table.component.html',
  styleUrl: './storage-table.component.css',
})
export class StorageTableComponent {
  private readonly folderService = inject(FolderService);
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  folderId = input<string>('');

  folderItems = input<FolderItem[]>([]);

  updateTable = output<void>();

  selectedItem: FolderItem | null = null;

  settingsMenuItems: MenuItem[] = [
    {
      label: 'Descargar',
      icon: 'pi pi-download',
      command: () => {
        if (!this.selectedItem) return;

        if (this.selectedItem.type === 'file') {
          this.downloadFile(this.selectedItem);
        } else {
          this.downloadFolder(this.selectedItem);
        }
      },
    },
    {
      label: 'Renombrar',
      icon: 'pi pi-pencil',
      command: () => {
        if (this.selectedItem?.type === 'folder') {
          this.isFolderDialogVisible.set(true);
        } else {
          this.isFileDialogVisible.set(true);
        }
      },
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        const selectedItem = { ...this.selectedItem };

        if (!selectedItem) return;

        this.handleItemDelete(selectedItem as FolderItem);
      },
    },
  ];

  isFolderDialogVisible = signal<boolean>(false);

  isFileDialogVisible = signal<boolean>(false);

  goToFolder(folderId: string): void {
    this.router.navigateByUrl(`/storage/${folderId}`);
  }

  downloadFile(file: FolderItem): void {
    this.alertService.displayMessage({
      severity: 'info',
      summary: 'Descargando archivo...',
      detail: `Descargando ${file.name}`,
      sticky: true,
    });

    this.fileService.getFileUrl(file.id).subscribe({
      next: async ({ url }) => {
        try {
          const blobUrl = await FileHelper.getBlobFileFromUrl(url);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = blobUrl;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);

          this.alertService.clearMessages();
        } catch {
          this.alertService.clearMessages();
          this.alertService.displayError('Error al descargar el archivo');
        }
      },
      error: () => {
        this.alertService.clearMessages();
        this.alertService.displayError('Error al descargar el archivo');
      },
    });
  }

  downloadFolder(folder: FolderItem): void {
    this.alertService.displayMessage({
      severity: 'info',
      summary: 'Descargando archivos...',
      detail: `Descargando ${folder.name}`,
      sticky: true,
    });

    this.folderService.downloadFolder(folder.id).subscribe({
      next: (response) => {
        this.alertService.clearMessages();

        const blobUrl = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = folder.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        this.alertService.displaySuccess('Carpeta descargada correctamente');
      },
      error: () => {
        this.alertService.clearMessages();
        this.alertService.displayError('Error al descargar la carpeta');
      },
    });
  }

  handleItemDelete(selectedItem: FolderItem): void {
    this.alertService.displayConfirm({
      header:
        selectedItem.type === 'file' ? 'Eliminar archivo' : 'Eliminar carpeta',
      message: `¿Está seguro de que desea eliminar ${selectedItem.name}?`,
      accept: () => {
        if (selectedItem.type === 'file') {
          this.deleteFiles([selectedItem.id || '']);
          return;
        }
        this.deleteFolders([selectedItem.id || '']);
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
    });
  }

  deleteFiles(fileIds: string[]): void {
    this.fileService.deleteFiles(fileIds).subscribe({
      next: () => {
        const message =
          fileIds.length > 1 ? 'Archivos eliminados' : 'Archivo eliminado';
        this.alertService.displaySuccess(`${message} correctamente`);
        this.updateTable.emit();
      },
      error: () => {
        const message = fileIds.length > 1 ? 'los archivos' : 'el archivo';
        this.alertService.displayError(`Error al eliminar ${message}`);
      },
    });
  }

  deleteFolders(folderIds: string[]): void {
    this.folderService.deleteFolders(folderIds).subscribe({
      next: () => {
        const message =
          folderIds.length > 1 ? 'Carpetas eliminadas' : 'Carpeta eliminada';
        this.alertService.displaySuccess(`${message} correctamente`);
        this.updateTable.emit();
      },
      error: () => {
        const message = folderIds.length > 1 ? 'las carpetas' : 'la carpeta';
        this.alertService.displayError(`Error al eliminar ${message}`);
      },
    });
  }

  closeDialog(reloadTable = false): void {
    this.isFolderDialogVisible.set(false);
    this.isFileDialogVisible.set(false);
    this.selectedItem = null;

    if (reloadTable) {
      this.updateTable.emit();
    }
  }
}
