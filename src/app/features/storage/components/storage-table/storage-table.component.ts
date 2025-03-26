import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { FolderItem } from 'src/app/core/models/folder-item';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileService } from 'src/app/core/services/file.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';

@Component({
  selector: 'app-storage-table',
  imports: [CommonModule, TableModule, ContextMenuModule, FileSizePipe],
  templateUrl: './storage-table.component.html',
  styleUrl: './storage-table.component.css',
})
export class StorageTableComponent {
  private readonly folderService = inject(FolderService);
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  folderItems = input<FolderItem[]>([]);

  updateTable = output<void>();

  selectedItem: FolderItem | null = null;

  settingsMenuItems: MenuItem[] = [
    {
      label: 'Descargar',
      icon: 'pi pi-download',
      command: () => {
        if (!this.selectedItem) return;
        this.downloadFile(this.selectedItem);
      },
    },
    {
      label: 'Renombrar',
      icon: 'pi pi-pencil',
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
          const fileFetched = await fetch(url);

          if (!fileFetched.ok) {
            throw new Error('Error al descargar el archivo');
          }

          const blob = await fileFetched.blob();
          const blobUrl = URL.createObjectURL(blob);
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
          this.alertService.displayMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al descargar el archivo',
          });
        }
      },
      error: () => {
        this.alertService.clearMessages();
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al descargar el archivo',
        });
      },
    });
  }

  handleItemDelete(selectedItem: FolderItem): void {
    if (selectedItem.type === 'file') {
      this.alertService.displayConfirm({
        header: 'Eliminar archivo',
        message: `¿Está seguro de que desea eliminar ${selectedItem.name}?`,
        accept: () => {
          this.deleteFiles([selectedItem.id || '']);
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

      return;
    }

    this.alertService.displayConfirm({
      header: 'Eliminar carpeta',
      message: `¿Está seguro de que desea eliminar ${selectedItem.name}?`,
      accept: () => {
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
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivos eliminados correctamente',
        });
        this.updateTable.emit();
      },
      error: () => {
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar los archivos',
        });
      },
    });
  }

  deleteFolders(folderIds: string[]): void {
    this.folderService.deleteFolders(folderIds).subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Carpetas eliminadas correctamente',
        });
        this.updateTable.emit();
      },
      error: () => {
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar las carpetas',
        });
      },
    });
  }
}
