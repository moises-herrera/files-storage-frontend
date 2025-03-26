import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderContent } from 'src/app/core/models/folder-content';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
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
  timer,
} from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FileService } from 'src/app/core/services/file.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { StorageTableComponent } from './components/storage-table/storage-table.component';
import { FolderItemDialogComponent } from './components/folder-item-dialog/folder-item-dialog.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

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
    FolderItemDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly folderService = inject(FolderService);
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | null = null;

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

  isAddFolderDialogVisible = signal<boolean>(false);

  addFolderItemsMenu: MenuItem[] = [
    {
      label: 'Subir archivo',
      icon: 'pi pi-upload',
      command: () => {
        if (!this.fileInput) return;
        this.fileInput.nativeElement.click();
      },
    },
    {
      label: 'Crear carpeta',
      icon: 'pi pi-folder-plus',
      command: () => {
        this.isAddFolderDialogVisible.set(true);
      },
    },
  ];

  searchTermControl = new FormControl<string | null>(null);

  page = signal<number>(1);

  pageSize = signal<number>(10);

  ngOnInit(): void {
    this.getFolderContent();
  }

  getFolderContent(): void {
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
          this.folderId = params['id'];

          return this.folderService.getFolderContent({
            folderId: this.folderId,
            search: search || '',
            page: this.page(),
            pageSize: this.pageSize(),
          });
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
          } else {
            this.folderId =
              data.folders.find(({ parentFolder }) => !parentFolder)?.id ?? '';
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

  closeAddFolderDialog(reloadTable = false): void {
    this.isAddFolderDialogVisible.set(false);
    if (reloadTable) {
      this.getFolderContent();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTermControl.reset();
  }
}
