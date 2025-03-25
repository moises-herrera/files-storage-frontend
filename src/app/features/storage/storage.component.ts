import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-storage',
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    TableModule,
    FileSizePipe,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit {
  private readonly folderService = inject(FolderService);

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
            const parentFolders: MenuItem[] = [];
            let parentFolder = data.folder.parentFolder;

            while (parentFolder) {
              console.log(parentFolder);
              parentFolders.unshift({
                label: parentFolder?.name,
                routerLink: `/storage/${parentFolder?.id}`,
              });

              parentFolder = parentFolder.parentFolder;
            }

            this.breadCrumbItems.set([
              {
                label: 'Mis archivos',
                routerLink: '/storage',
              },
              ...parentFolders.slice(1),
              {
                label: data.folder.name,
                routerLink: `/storage/${this.folderId}`,
              },
            ]);

            this.title.setTitle(`${environment.appName} - ${data.folder.name}`);
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
}
