import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, Observable, of } from 'rxjs';
import { FileInfo } from 'src/app/core/models/file-info';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileService } from 'src/app/core/services/file.service';
import { FileItemDialogComponent } from 'src/app/features/storage/components/file-item-dialog/file-item-dialog.component';
import { FileHelper } from 'src/app/shared/helpers/file-helper';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';
import { FileTypePipe } from 'src/app/shared/pipes/file-type.pipe';

@Component({
  selector: 'app-files-table',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ContextMenuModule,
    FileSizePipe,
    TooltipModule,
    ConfirmDialogModule,
    FileItemDialogComponent,
    FileTypePipe,
  ],
  templateUrl: './files-table.component.html',
  styleUrl: './files-table.component.css',
})
export class FilesTableComponent implements OnInit {
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  recentFiles$ = signal<Observable<FileInfo[]>>(of([]));

  selectedItem: FileInfo | null = null;

  isFileDialogVisible = signal<boolean>(false);

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
      command: () => {
        this.isFileDialogVisible.set(true);
      },
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        const selectedItem = { ...this.selectedItem };

        if (!selectedItem) return;

        this.handleItemDelete(selectedItem as FileInfo);
      },
    },
  ];

  ngOnInit(): void {
    this.getRecentFiles();
  }

  getRecentFiles(): void {
    this.recentFiles$.set(
      this.fileService.getRecentFiles().pipe(
        catchError(() => {
          this.alertService.displayError(
            'Error al cargar los archivos recientes'
          );
          return of([]);
        })
      )
    );
  }

  goToFolder(folderId: string): void {
    this.router.navigateByUrl(`/storage/${folderId}`);
  }

  downloadFile(file: FileInfo): void {
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

  handleItemDelete(selectedItem: FileInfo): void {
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
  }

  deleteFiles(fileIds: string[]): void {
    this.fileService.deleteFiles(fileIds).subscribe({
      next: () => {
        this.alertService.displaySuccess('Archivos eliminados correctamente');
        this.getRecentFiles();
      },
      error: () => {
        this.alertService.displayError('Error al eliminar los archivos');
      },
    });
  }

  closeDialog(reloadTable = false): void {
    this.isFileDialogVisible.set(false);
    if (reloadTable) {
      this.getRecentFiles();
    }
  }
}
