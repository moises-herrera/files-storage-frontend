import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { FolderRelated } from 'src/app/core/models/folder-related';
import { AlertService } from 'src/app/core/services/alert.service';
import { FolderService } from 'src/app/core/services/folder.service';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-folders-grid',
  imports: [CommonModule, RouterModule, TooltipModule],
  templateUrl: './folders-grid.component.html',
  styleUrl: './folders-grid.component.css',
})
export class FoldersGridComponent {
  private readonly folderService = inject(FolderService);
  private readonly alertService = inject(AlertService);

  recentFolders$ = signal<Observable<FolderRelated[]>>(
    this.folderService.getRecentFolders().pipe(
      catchError(() => {
        this.alertService.displayError(
          'Error al cargar las carpetas recientes'
        );
        return of([]);
      })
    )
  );
}
