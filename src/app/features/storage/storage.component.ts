import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderContent } from 'src/app/core/models/folder-content';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { FolderItem } from 'src/app/core/models/folder-item';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FileService } from 'src/app/core/services/file.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { StorageTableComponent } from './components/storage-table/storage-table.component';

@Component({
  selector: 'app-storage',
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    InputTextModule,
    StorageTableComponent,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit {
  private readonly folderService = inject(FolderService);
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
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
}
