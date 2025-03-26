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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FileService } from 'src/app/core/services/file.service';
import { AlertService } from 'src/app/core/services/alert.service';

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

    this.fileService.uploadFile(files[0], this.folderId()).subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo subido correctamente',
        });
        this.updateTable.emit();
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
      this.updateTable.emit();
    }
  }
}
