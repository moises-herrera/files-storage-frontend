import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FolderContent } from 'src/app/core/models/folder-content';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { MenuItem } from 'primeng/api';
import { FolderItem } from 'src/app/core/models/folder-item';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  debounce,
  distinctUntilChanged,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { StorageTableComponent } from './components/storage-table/storage-table.component';
import { FormControl } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FilesDropZoneComponent } from 'src/app/shared/components/files-drop-zone/files-drop-zone.component';
import { FolderRelated } from 'src/app/core/models/folder-related';

@Component({
  selector: 'app-storage',
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    StorageTableComponent,
    HeaderComponent,
    FilesDropZoneComponent,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly folderService = inject(FolderService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  folderId = signal<string>('');

  currentFolder = signal<FolderRelated | undefined>(undefined);

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

  searchTermControl = new FormControl<string | null>(null);

  page = signal<number>(1);

  pageSize = signal<number>(10);

  ngOnInit(): void {
    this.getFolderContent();
  }

  getFolderContent(): void {
    this.destroy$.next();

    combineLatest({
      params: this.route.params,
      search: this.searchTermControl.valueChanges.pipe(
        startWith(null),
        debounce((value) => (value === null ? timer(0) : timer(300))),
        distinctUntilChanged()
      ),
    })
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ params, search }) => {
          this.folderId.set(params['id']);

          return this.folderService.getFolderContent({
            folderId: this.folderId() ?? '',
            search: search || '',
            page: this.page(),
            pageSize: this.pageSize(),
          });
        })
      )
      .subscribe({
        next: (data) => {
          if (this.folderId()) {
            const folderFound = data.folders.find(
              ({ id }) => this.folderId() === id
            );

            if (!folderFound) {
              this.alertService.displayError('No se ha encontrado la carpeta');
              this.router.navigate(['/storage']);
              return;
            }

            const foldersHierarchy: MenuItem[] = [...data.folders]
              .reverse()
              .slice(1)
              .map(({ id, name }) => ({
                id,
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

            this.title.setTitle(`${environment.appName} - ${folderFound.name}`);

            this.currentFolder.set(folderFound);
          } else {
            this.currentFolder.set(
              data.folders.find(({ parentFolder }) => !parentFolder)
            );
          }

          this.folderContent.set(data);
        },
        error: () => {
          this.alertService.displayError(
            'Error al cargar el contenido de la carpeta'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTermControl.reset();
  }
}
