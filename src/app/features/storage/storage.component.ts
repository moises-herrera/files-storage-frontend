import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FolderContent } from 'src/app/core/models/folder-content';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { FolderItem } from 'src/app/core/models/folder-item';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FileService } from 'src/app/core/services/file.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-storage',
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    TableModule,
    FileSizePipe,
    ButtonModule,
    MenuModule,
    ContextMenuModule,
    ConfirmDialogModule,
    InputTextModule,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit {
  private readonly folderService = inject(FolderService);
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  folderId = '';

  folderContent = signal<FolderContent>({} as FolderContent);

  folderItems = computed<FolderItem[]>(() => {
    return this.folderContent().items?.data || [];
  });

  breadCrumbItems = signal<MenuItem[]>([
    {
      label: 'Mis archivos',
      routerLink: '/storage',
    },
  ]);

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

  selectedItem: FolderItem | null = null;

  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.getFolderContent();
  }

  getFolderContent(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.folderId = params['id'];
          return this.folderService.getFolderContent(this.folderId);
        })
      )
      .subscribe({
        next: (data) => {
          if (this.folderId) {
            const foldersHierarchy: MenuItem[] = [...data.folders]
              .reverse()
              .slice(1)
              .map(({ id, name }) => ({
                label: name,
                routerLink: `/storage/${id}`,
              }));

            this.breadCrumbItems.set([
              {
                label: 'Mis archivos',
                routerLink: '/storage',
              },
              ...foldersHierarchy,
            ]);

            this.title.setTitle(
              `${environment.appName} - ${data.folders[0].name}`
            );
          }

          this.folderContent.set(data);
        },
        error: () => {
          this.alertService.displayMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el contenido de la carpeta',
          });
        },
      });
  }

  goToFolder(folderId: string): void {
    this.router.navigateByUrl(`/storage/${folderId}`);
  }

  uploadFile(eventTarget: EventTarget | null): void {
    if (!eventTarget) return;

    const input = eventTarget as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    this.fileService.uploadFile(files[0], this.folderId).subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo subido correctamente',
        });
        this.getFolderContent();
      },
      error: () => {
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir el archivo',
        });
      },
    });
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
        this.getFolderContent();
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
        this.getFolderContent();
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
