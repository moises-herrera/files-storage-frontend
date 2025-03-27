import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FolderItemDialogComponent } from '../folder-item-dialog/folder-item-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FileService } from 'src/app/core/services/file.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FileHelper } from 'src/app/shared/helpers/file-helper';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    FolderItemDialogComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly fileService = inject(FileService);
  private readonly alertService = inject(AlertService);

  ALLOWED_FILE_TYPES = FileHelper.ALLOWED_FILE_TYPES;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | null = null;

  folderId = input<string>('');

  updateTable = output<void>();

  searchTerm = input<string>('');

  searchTermChange = output<string>();

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

  uploadFile(eventTarget: EventTarget | null): void {
    if (!eventTarget) return;

    const input = eventTarget as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const hasBigFile = fileArray.some(
      (file) => file.size > FileHelper.MAX_FILE_SIZE
    );

    if (hasBigFile) {
      this.alertService.displayError(
        `El tamaño máximo para archivos es ${FileHelper.MAX_FILE_SIZE_MB} MB`
      );
      return;
    }

    const hasInvalidFileType = fileArray.some(
      (file) => FileHelper.ALLOWED_FILE_TYPES.indexOf(file.type) === -1
    );

    if (hasInvalidFileType) {
      this.alertService.displayError('Tipo de archivo no permitido');
      return;
    }

    this.fileService.uploadFile(files, this.folderId()).subscribe({
      next: () => {
        this.alertService.displaySuccess('Archivos subidos correctamente');
        this.updateTable.emit();
      },
      error: () => {
        this.alertService.displayError('Error al subir los archivos');
      },
    });
  }

  closeAddFolderDialog(reloadTable = false): void {
    this.isAddFolderDialogVisible.set(false);
    if (reloadTable) {
      this.updateTable.emit();
    }
  }
}
